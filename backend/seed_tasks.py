"""Run this script once to populate the tasks table with initial sketching exercises."""
from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
from models import Task

TASKS = [
    {
        "title": "Everyday Object",
        "description": "Pick any object within arm's reach — a cup, pen, phone, or shoe. Draw it from observation focusing on its outline and proportions. Aim to capture the overall shape accurately rather than adding detail.",
        "difficulty": "easy",
    },
    {
        "title": "Your Non-Dominant Hand",
        "description": "Place your non-dominant hand on the table in a natural relaxed position. Draw it as accurately as you can, paying attention to the joints, fingernails, and the spaces between fingers.",
        "difficulty": "easy",
    },
    {
        "title": "A Corner of the Room",
        "description": "Choose a corner of the room you're in and sketch it using one-point perspective. Include at least two walls, the floor, and any furniture or objects visible in the corner.",
        "difficulty": "medium",
    },
    {
        "title": "Crumpled Paper",
        "description": "Crumple a piece of paper into a loose ball and place it in front of you. Sketch it focusing on the shadows and highlights that define the folds and ridges. Use hatching or shading to show depth.",
        "difficulty": "medium",
    },
    {
        "title": "Portrait from Memory",
        "description": "Draw a portrait of a person from memory — a friend, family member, or public figure. Focus on capturing the overall shape of the face, placement of features, and any distinctive characteristics.",
        "difficulty": "medium",
    },
    {
        "title": "Urban Scene",
        "description": "Sketch a street scene, building façade, or city view — either from a window or from memory. Include at least two architectural elements (windows, doors, balconies) and show basic perspective.",
        "difficulty": "hard",
    },
    {
        "title": "Gesture Figure",
        "description": "Draw a full human figure in a dynamic pose — someone reaching, bending, running, or dancing. Focus on the gesture and flow of the pose rather than anatomical detail. Use loose expressive lines.",
        "difficulty": "hard",
    },
    {
        "title": "Still Life Composition",
        "description": "Arrange 3–5 objects of different shapes and sizes in front of you. Draw the full composition, paying attention to how the objects overlap, their relative sizes, and the negative space between them.",
        "difficulty": "hard",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Task).count()
        if existing > 0:
            print(f"Tasks table already has {existing} rows. Skipping seed.")
            return
        for t in TASKS:
            db.add(Task(**t))
        db.commit()
        print(f"Seeded {len(TASKS)} tasks.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
