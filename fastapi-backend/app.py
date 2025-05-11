from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
import uuid



from extract_skills import parseText, extract_skills, matcher
from grammar import highlight_grammar_issues
from generateq import generate_interview_questions_from_text
from suggestions import generate_resume_suggestions
from formatchecker import check_resume_formatting
from scrapper import scrape
app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods: GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allow all headers
)

@app.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_id = str(uuid.uuid4())
    uploaded_filename = f"{file_id}.pdf"
    filepath = os.path.join(UPLOAD_DIR, uploaded_filename)
    print(filepath)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(resume.file, f)

    resume_text = parseText(filepath)

    # Grammar highlighting
    highlighted_filename = f"{file_id}_corrected.pdf"
    corrected_path = os.path.join(UPLOAD_DIR, highlighted_filename)
    score, _ = highlight_grammar_issues(filepath, corrected_path)

    return JSONResponse({
        "resume_text": resume_text,
        "job_description": job_description,
        "uploaded_filename": uploaded_filename,
        "highlighted_filename": highlighted_filename,
        "grammar_score": score
    })


@app.post("/matched-skills")
async def get_matched_skills(
    resume_text: str = Form(...),
    job_description: str = Form(...)
):
    jd_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)
    matched, unmatched = matcher(jd_skills, resume_skills)
    return {"matched": matched, "unmatched": unmatched}


@app.post("/questions")
async def get_questions(
    resume_text: str = Form(...),
    job_description: str = Form(...)
):
    questions = generate_interview_questions_from_text(resume_text, job_description)
    return questions


@app.post("/suggestions")
async def get_suggestions(
    resume_text: str = Form(...),
    job_description: str = Form(...)
):
    suggestions = generate_resume_suggestions(resume_text, job_description)
    return {"suggestions": suggestions}

@app.post("/formatting-checker")
async def get_format_score(filename: str = Form(...)):
    abs_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(abs_path):
        return JSONResponse(status_code=404, content={"error": "File not found"})
    print(filename)
    format_score, deductions = check_resume_formatting(abs_path)
    return {
        "score": format_score,
        "deductions": deductions
    }

@app.get("/download-file")
async def download_file(filename: str = Query(...)):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
        headers={"Content-Disposition": "inline; filename=" + filename}
    )
    
@app.post("/scrape-jobs")
async def scrape_jobs_from_resume(resume_text : str = Form(...)):
    try:
        jobs = scrape(resume_text)
        return jobs

        #return JSONResponse(content=jobs.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
