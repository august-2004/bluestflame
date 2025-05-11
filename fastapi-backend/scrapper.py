from jobspy import scrape_jobs
from extract_skills import extract_skills
import pandas as pd
def scrape(resume_text):
    skills = extract_skills(resume_text, 1)
    search_terms = ', '.join(skills)
    jobs = scrape_jobs(
        site_name=["linkedin", 'indeed'],
        search_term=search_terms,
        location="Chennai, India",
        hours_old=72,
        country_indeed="India",
        linkedin_fetch_description=True,)

    selected_columns = jobs[["job_url", "title", "company", "location", "description", "company_logo"]]
    selected_columns = selected_columns.where(pd.notnull(selected_columns), None)

    return selected_columns.to_dict(orient="records")