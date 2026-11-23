"""
FastAPI Server for Enterprise Image & PDF Processing
Provides server-side batch fallback, format conversions, and background job handling.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import os
import uuid
import shutil
import zipfile
from io import BytesIO
from typing import List, Optional
from PIL import Image, ImageOps, ImageFilter

app = FastAPI(
    title="PI Hub Processing Engine API",
    version="1.0.0",
    description="Microservice for bulk image and PDF manipulation"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "PI Hub Media Engine",
        "version": "1.0.0",
        "supported_engines": ["Pillow", "pikepdf", "pdf-lib"]
    }


@app.post("/api/v1/images/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(75)
):
    try:
        job_id = str(uuid.uuid4())
        job_folder = os.path.join(TEMP_DIR, job_id)
        os.makedirs(job_folder, exist_ok=True)

        input_path = os.path.join(job_folder, file.filename)
        output_filename = f"compressed_{file.filename}"
        output_path = os.path.join(job_folder, output_filename)

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with Image.open(input_path) as img:
            # Handle alpha channel
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(output_path, "JPEG", optimize=True, quality=quality)

        return FileResponse(
            output_path,
            filename=output_filename,
            media_type="image/jpeg"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/images/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    percentage: Optional[int] = Form(None)
):
    try:
        job_id = str(uuid.uuid4())
        job_folder = os.path.join(TEMP_DIR, job_id)
        os.makedirs(job_folder, exist_ok=True)

        input_path = os.path.join(job_folder, file.filename)
        output_filename = f"resized_{file.filename}"
        output_path = os.path.join(job_folder, output_filename)

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with Image.open(input_path) as img:
            orig_w, orig_h = img.size
            if percentage:
                scale = percentage / 100.0
                new_w = max(1, int(orig_w * scale))
                new_h = max(1, int(orig_h * scale))
            else:
                new_w = width or orig_w
                new_h = height or orig_h

            resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            resized_img.save(output_path)

        return FileResponse(output_path, filename=output_filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/images/batch-zip")
async def batch_zip_images(files: List[UploadFile] = File(...)):
    """Packages multiple uploaded files into a zip archive"""
    try:
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                contents = await file.read()
                zip_file.writestr(file.filename, contents)

        zip_buffer.seek(0)
        return FileResponse(
            zip_buffer,
            filename="pihub_batch.zip",
            media_type="application/zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
