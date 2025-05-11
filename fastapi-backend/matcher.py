import spacy

ner_model_path = r"Models/model-best"
ner_model = spacy.load(ner_model_path)
def matcher(resume_skills, job_description_skills):
    