import os
import uuid
import boto3
from botocore.config import Config

R2_ENDPOINT = os.environ["R2_ENDPOINT"]
R2_ACCESS_KEY = os.environ["R2_ACCESS_KEY"]
R2_SECRET_KEY = os.environ["R2_SECRET_KEY"]
R2_BUCKET = os.environ.get("R2_BUCKET", "sketch-uploads")
R2_PUBLIC_URL = os.environ.get("R2_PUBLIC_URL", "")  # optional CDN URL prefix


def _get_client():
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def upload_image(file_bytes: bytes, content_type: str = "image/jpeg") -> str:
    """Upload bytes to R2 and return the public URL."""
    key = f"sketches/{uuid.uuid4()}.jpg"
    client = _get_client()
    client.put_object(
        Bucket=R2_BUCKET,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )
    if R2_PUBLIC_URL:
        return f"{R2_PUBLIC_URL.rstrip('/')}/{key}"
    # Fall back to presigned URL (valid 7 days)
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": R2_BUCKET, "Key": key},
        ExpiresIn=604800,
    )
