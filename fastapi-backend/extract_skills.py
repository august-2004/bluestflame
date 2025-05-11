import spacy
import fitz
from gensim.models import KeyedVectors
import re
from sentence_transformers import SentenceTransformer, util
import torch

ner_model_path = r"Models/model-best"
ner_model = spacy.load(ner_model_path)
#similarity_model = KeyedVectors.load_word2vec_format(r"skill2vec.model")

def extract_skills(text, flag = 0):
    doc = ner_model(text)
    # Extract skills, convert to lowercase, and remove punctuation
    if flag ==1 :
        skills = list({
        re.sub(r'[^\w\s]+', '', ent.text.lower())  # Remove non-alphanumeric characters
        for ent in doc.ents if ent.label_ == "SKILLS" or ent.label_ == "EDUCATION"
        })
    else:    
        skills = list({
            re.sub(r'[^\w\s]+', '', ent.text.lower())  # Remove non-alphanumeric characters
            for ent in doc.ents if ent.label_ == "SKILLS"
        })
    
    return skills


def parseText(resume_path):
    text = ""
    with fitz.open(resume_path) as doc:
        if len(doc) > 0:  
            text = doc[0].get_text()  
    return text

# def matcher(resume_skills, job_description_skills):
#     SIMILARITY_THRESHOLD = 0.75

#     matched = []
#     unmatched = []

#     for res_skill in resume_skills:
        
        
#         best_match = None
#         best_score = 0
        
#         for job_skill in job_description_skills:
            
#             try:
#                 similarity = similarity_model.similarity(res_skill, job_skill)
#             except Exception as e:
#                 similarity = 0.0  # Handle the case where the word is not in the model
#             if similarity > best_score:
#                 best_score = similarity
#                 best_match = job_skill


#         if best_score >= SIMILARITY_THRESHOLD:
#             print(f"Matched: {res_skill} with {best_match} (Score: {best_score})")
#             matched.append(res_skill)
#         else:
#             print(f"Unmatched: {res_skill} (Best Match: {best_match} with Score: {best_score})")
            
        
#     unmatched = [job_skill for job_skill in job_description_skills if job_skill not in matched]
#     return matched, unmatched
    
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')

def matcher(resume_skills, job_description_skills):
    SIMILARITY_THRESHOLD = 0.75

    matched = []
    unmatched_resume_skills = []
    unmatched_job_description_skills = job_description_skills.copy()
    used_job_indices = set()  # Track which job skills have already been matched

    # Encode all skills
    resume_embeddings = similarity_model.encode(resume_skills, convert_to_tensor=True)
    job_embeddings = similarity_model.encode(job_description_skills, convert_to_tensor=True)

    for idx, res_embedding in enumerate(resume_embeddings):
        res_skill = resume_skills[idx]
        cosine_scores = util.pytorch_cos_sim(res_embedding, job_embeddings)[0]

        # Exclude already matched job skills by setting their score to -1
        for i in used_job_indices:
            cosine_scores[i] = -1.0

        best_score = torch.max(cosine_scores).item()
        best_match_idx = torch.argmax(cosine_scores).item()
        best_match = job_description_skills[best_match_idx]

        if best_score >= SIMILARITY_THRESHOLD:
            matched.append(res_skill)
            used_job_indices.add(best_match_idx)
            unmatched_job_description_skills.remove(best_match)
        else:
            unmatched_resume_skills.append(res_skill)

    # Return matched skills and unmatched skills from the job description
    return matched, unmatched_resume_skills



