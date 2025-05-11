import PyPDF2
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re
load_dotenv()

# Configure Gemini model (only once globally)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

def generate_interview_questions_from_text(resume_text: str, job_description: str) -> dict:
    """
    Takes parsed resume text and a job description string, 
    returns categorized interview questions as a JSON dictionary.
    """
    try:
        prompt = f"""
        You are an interviewer reviewing the following resume and job description.
        Create a set of questions personalized to the resume and job description containing categorized interview questions.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Format your output with the following categories:
        - Technical Questions
        - Work Experience Questions
        - Educational Background Questions
        - Behavioral/Situational Questions
        - Leadership/Teamwork Questions

        Make sure to give the questions as a list under each category, keep them numbered and title in uppercase. Avoid any kind of text formatting
        """

        response = model.generate_content(prompt)
        if not response or not response.text.strip():
            raise ValueError("No response text returned from model.")
        
        
        print(f"Model response: {response.text}")
        return response.text
















    except json.JSONDecodeError as e:
        raise RuntimeError(f"Invalid JSON in model response: {response.text}") from e
    
    except Exception as e:
        raise RuntimeError(f"Error generating questions: {str(e)}")

