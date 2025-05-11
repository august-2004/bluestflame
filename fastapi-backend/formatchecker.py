from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar
import re

def check_resume_formatting(pdf_path):
    score = 100
    deductions = []
    text = ''
    fonts = []
    print(pdf_path)

    for page_layout in extract_pages(pdf_path):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                text += element.get_text()
                for text_line in element:
                    for character in text_line:
                        if isinstance(character, LTChar):
                            fonts.append((character.fontname, character.size))

    # Basic text-based analysis
    lines = text.split('\n')

    # Length check
    if len(text) < 300:
        score -= 30
        deductions.append("Resume is too short")

    # Section headers: look for lines in all caps and possibly bold
    has_headers = any(line.isupper() and len(line.strip()) > 3 for line in lines)
    if not has_headers:
        score -= 20
        deductions.append("No clear section headers found")

    # Bullet points
    if not any(line.strip().startswith(('•', '-', '*', '→')) for line in lines):
        score -= 20
        deductions.append("No bullet points found for listing details")

    # Consistent spacing
    if any(len(line.strip()) == 0 and len(next_line.strip()) == 0 
           for line, next_line in zip(lines[:-1], lines[1:])):
        score -= 15
        deductions.append("Inconsistent spacing between sections")

    # Contact info check
    contact_patterns = [
        r'\b[\w\.-]+@[\w\.-]+\.\w+\b',           # email
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',     # phone
        r'linkedin\.com/(in/)?[\w\-]+',          # LinkedIn
    ]
    if not any(re.search(pattern, text, re.IGNORECASE) for pattern in contact_patterns):
        score -= 15
        deductions.append("Missing or improperly formatted contact information")

    # Section presence
    expected_sections = ['education', 'experience', 'skills', 'projects', 'certifications']
    found_sections = [sec for sec in expected_sections if any(sec in line.lower() for line in lines)]
    if len(found_sections) < 3:
        score -= 10
        deductions.append("Too few standard resume sections found")

    # Date formats
    date_pattern = r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b|\b\d{2}/\d{4}\b'
    if not re.search(date_pattern, text):
        score -= 5
        deductions.append("No date ranges found (e.g., work timelines)")

    # Capitalization balance
    if text.upper() == text or text.lower() == text:
        score -= 5
        deductions.append("Resume uses only uppercase or lowercase")

    # Bullet point verbs
    action_verbs = ["Developed", "Implemented", "Led", "Created", "Designed", "Improved", "Managed", "Analyzed"]
    bullet_lines = [line.strip() for line in lines if line.strip().startswith(('•', '-', '*', '→'))]
    if bullet_lines:
        weak_bullets = [line for line in bullet_lines if not any(line[1:].strip().startswith(verb) for verb in action_verbs)]
        if len(weak_bullets) > len(bullet_lines) * 0.5:
            score -= 5
            deductions.append("Most bullet points lack strong action verbs")

    # Generic phrases
    generic_phrases = ['hardworking', 'team player', 'go-getter', 'fast learner']
    if any(phrase in text.lower() for phrase in generic_phrases):
        score -= 5
        deductions.append("Contains generic phrases without context (e.g., 'hardworking')")

    # Font consistency and bold headers check
    font_names = [f[0] for f in fonts]
    if len(set(font_names)) > 4:
        score -= 5
        deductions.append("Too many different font styles used")

    bold_fonts = [f for f in fonts if 'Bold' in f[0]]
    if not bold_fonts:
        score -= 5
        deductions.append("No bold fonts found (e.g., for section headers)")

    return max(0, score), deductions
