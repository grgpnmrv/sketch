from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, storage, ai
from auth import get_current_user_optional, get_current_user

router = APIRouter(prefix="/sketches", tags=["sketches"])


@router.post("/upload", response_model=schemas.FeedbackOut)
async def upload_sketch(
    image: UploadFile = File(...),
    task_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image")

    # Determine task description for AI prompt
    task_description = "Draw a sketch based on your own creativity."
    if task_id:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task:
            task_description = task.description

    # Upload to R2
    image_url = storage.upload_image(image_bytes, content_type=image.content_type or "image/jpeg")

    # Get AI feedback
    feedback = ai.get_feedback(image_bytes, task_description)

    # Save to DB if user is authenticated
    if current_user:
        sketch = models.Sketch(
            user_id=current_user.id,
            task_id=task_id,
            image_url=image_url,
            score=feedback["score"],
            feedback_json={"green": feedback.get("green", []), "yellow": feedback.get("yellow", [])},
        )
        db.add(sketch)
        db.commit()

    return schemas.FeedbackOut(
        score=feedback["score"],
        green=feedback.get("green", []),
        yellow=feedback.get("yellow", []),
    )


@router.get("/history", response_model=list[schemas.SketchOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Sketch)
        .filter(models.Sketch.user_id == current_user.id)
        .order_by(models.Sketch.created_at.desc())
        .all()
    )
