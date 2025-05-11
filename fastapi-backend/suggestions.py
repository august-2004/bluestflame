import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

def clean_text(text: str) -> str:
    return " ".join(text.split())

def generate_resume_suggestions(resume_text: str, job_description: str) -> str:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    prompt = f"""
    Rewrite the following resume sentence to be more professional, keeping in mind the job description: {job_description}.
    The resume sentence is: {clean_text(resume_text)}.
    Format the output as a set of suggestions (numbered) under each title (in uppercase), with the following title:
    - Work Experience Suggestions
    - Education Suggestions
    - Skills Suggestions
    
    Mention in which section each suggestion should be placed. Give the suggestions as statement, not as a question.
    If the resume is not relevant, return a key called "Other" with a short explanation.
    """
    try:
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return response.json()['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error: {response.status_code} - {response.text}"
    except (KeyError, IndexError):
        return "Gemini response parsing failed."
    
