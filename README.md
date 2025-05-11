# BLUEST FLAME - AI Resume Assistant

BLUEST FLAME is an AI-powered Resume Analyzer and Job Application Assistant that helps users improve their resumes for Applicant Tracking Systems (ATS) and job applications.

## Overview

This project consists of two main components:

- A FastAPI backend for AI-powered resume analysis
- A Next.js frontend for user interaction
![Bluest Flame SW-017-page-00006](https://github.com/user-attachments/assets/eb0560a6-f951-4c9c-a61f-e385f25a7a1e)

The application helps job seekers by:

1. Analyzing resumes against job descriptions
2. Identifying matching and missing skills
3. Evaluating resume formatting and grammar
4. Generating interview questions based on the resume and job
5. Providing resume improvement suggestions
6. Finding relevant job listings that match the user's skills

## Features

- **Resume Analysis**: Upload your resume and get detailed feedback
- **Skill Matching**: See which skills in your resume match or don't match the job description
- **Grammar Check**: Receive a grammar score and highlighted issues
- **Format Analysis**: Get formatting suggestions and a score based on resume best practices
- **Role Match**: View a percentage match between your resume and the job description
- **Resume Suggestions**: Receive AI-generated suggestions to improve your resume
- **Job Recommendations**: Browse related job listings based on your resume
- **Interview Preparation**: Get AI-generated interview questions to help prepare

## Tech Stack
![Bluest Flame SW-017-page-00003](https://github.com/user-attachments/assets/1dc658da-5bab-4cea-9123-20eccf39e7f4)

### Backend

- **FastAPI**: High-performance Python web framework
- **Spacy NER**: Custom-trained Named Entity Recognition model for skill extraction
- **PDF Mining**: Extract and analyze content from PDF resumes
- **Web Scraping**: Find relevant job listings
- **Sentence Transformers**: For semantic matching of skills
- **Language Tool**: For grammar checking

### Frontend

- **Next.js**: React framework for web applications
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **React Components**: Custom components for visualizations and UI

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd fastapi-backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. **Important: Train the NER model**
   This repository doesn't include the trained model due to its large size (~700MB). You'll need to train it yourself:

```bash
# First, create the output directory
mkdir -p Models/model-best

# Train the model using the provided configuration and data
python -m spacy train Configs/config.cfg --output Models/model-best --paths.train Data/train_data.spacy --paths.dev Data/valid_data.spacy
```

The training uses the NER data in Data/ner.json which contains annotated job descriptions with labeled skills.

4. Run the FastAPI server:

```bash
uvicorn app:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd nextjs-frontend
```

2. Install Node.js dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works
![Bluest Flame SW-017-page-00005](https://github.com/user-attachments/assets/f9342147-b42e-4c71-9f6d-8197e194703a)

### Resume Upload Flow

1. User uploads a resume PDF and enters a job description on the home page
2. The frontend sends these to the FastAPI backend
3. The backend processes the resume and compares it with the job description
4. Results are stored in the browser's localStorage
5. User is redirected to the results page

### Analysis Components

#### Skill Matching

The [`extract_skills.py`](fastapi-backend/extract_skills.py) module uses the custom-trained Spacy NER model to extract skills from both the resume and job description, then the [`matcher.py`](fastapi-backend/matcher.py) module compares them to find matches and gaps.

#### Grammar Check

The [`grammar.py`](fastapi-backend/grammar.py) module analyzes the resume text for grammatical issues and provides a score.

#### Format Analysis

The [`formatchecker.py`](fastapi-backend/formatchecker.py) evaluates resume formatting based on best practices:

- Section headers
- Bullet points
- Font consistency
- Contact information
- Date formats
- Action verbs

#### Resume Suggestions

The [`suggestions.py`](fastapi-backend/suggestions.py) module generates AI-powered suggestions for improving the resume.

#### Job Recommendations

The [`scrapper.py`](fastapi-backend/scrapper.py) module finds relevant job listings based on the resume content.

#### Interview Questions

The [`generateq.py`](fastapi-backend/generateq.py) module creates personalized interview questions based on the resume and job description.

## Project Structure

```
bluest-flame/
├── fastapi-backend/         # Python backend
│   ├── app.py               # Main FastAPI application
│   ├── extract_skills.py    # Skill extraction module using Spacy NER
│   ├── formatchecker.py     # Resume format analysis
│   ├── generateq.py         # Interview question generator
│   ├── grammar.py           # Grammar checker
│   ├── matcher.py           # Skill matching algorithm
│   ├── requirements.txt     # Python dependencies
│   ├── resumeparser.py      # Resume parsing utilities
│   ├── scrapper.py          # Job listing scraper
│   ├── skill2vec.model      # Word vector model for skills
│   ├── suggestions.py       # Resume suggestion generator
│   ├── Configs/             # Spacy configuration files
│   │   ├── base_config.cfg  # Base configuration template
│   │   └── config.cfg       # Complete configuration for training
│   ├── Data/                # Training data
│   │   ├── ner.json         # NER annotations for skills
│   │   ├── train_data.spacy # Processed training data
│   │   └── valid_data.spacy # Processed validation data
│   └── Models/              # Directory for trained NER model
│       └── model-best/      # Will contain trained model files after setup
│
└── nextjs-frontend/         # React frontend
    ├── src/                 # Source files
    ├── public/              # Static assets
    ├── .next/               # Next.js build output
    ├── next.config.mjs      # Next.js configuration
    ├── postcss.config.mjs   # PostCSS configuration
    └── package.json         # Node dependencies
```

## NER Model Training Details

The project uses a custom Spacy NER model trained to identify skills in job descriptions and resumes. The model configuration in [`Configs/config.cfg`](fastapi-backend/Configs/config.cfg) defines:

- A Tok2Vec component with MultiHashEmbed for embedding tokens
- A named entity recognition (NER) component to extract skills
- Training parameters for batch size, dropout, learning rate, etc.

The annotated data in [`Data/ner.json`](fastapi-backend/Data/ner.json) contains thousands of job descriptions with skills labeled as "SKILLS" entities.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- The BLUEST FLAME Team - Led by Vanjinathan A
  ![Bluest Flame SW-017-page-00008](https://github.com/user-attachments/assets/9e18492f-20f7-45b2-a3c6-2df40577656e)

