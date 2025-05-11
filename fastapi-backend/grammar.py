import fitz  
import language_tool_python
import spacy
nlp = spacy.load("en_core_web_sm")


# research about scispacy for abbreviations and acronyms
source = "resume1.pdf"
target = "sample_output.pdf"

def is_named_entity(text):
    doc = nlp(text)
    return any(ent.label_ in {"PERSON", "ORG", "GPE", "LOC", "PRODUCT"} for ent in doc.ents)

def grammar_score(text, num_errors):
    word_count = len(text.split())
    if word_count == 0:
        return 0
    error_ratio = num_errors / word_count
    raw_score = 100 - (error_ratio * 1000)
    return max(30, round(raw_score))  

def highlight_grammar_issues(pdf_path, output_path):
    tool = language_tool_python.LanguageTool('en-US')
    doc = fitz.open(pdf_path)

    total_errors = 0
    total_text = ""

    for page_num in range(len(doc)):
        page = doc[page_num]    
        text = page.get_text()
        total_text += " " + text
        matches = tool.check(text)

        link_rects = []
        for link in page.get_links():
            if 'from' in link:
                link_rects.append(fitz.Rect(link['from']))

        for match in matches:
            issue_text = text[match.offset : match.offset + match.errorLength]

            if len(issue_text.strip()) < 3:
                continue

            # If it's a spelling error and a named entity → skip
            if match.ruleId == "MORFOLOGIK_RULE_EN_US" and is_named_entity(match.context):
                continue

            # Count only real issues (after filtering)
            if match.ruleId != "MORFOLOGIK_RULE_EN_US":
                total_errors += 1

            # Find instances of the issue text
            text_instances = page.search_for(issue_text)
            for inst in text_instances:
                if any(inst.intersects(link_rect) for link_rect in link_rects):
                    continue
                highlight = page.add_highlight_annot(inst)
                highlight.set_info(title="Grammar Suggestion", content=match.message)

    doc.save(output_path, garbage=4, deflate=True)
    print(f"Highlighted PDF saved as '{output_path}'")

    score = grammar_score(total_text, total_errors)
    print(f"\nGrammar Score: {score}/100")
    return score,output_path



if __name__ == '__main__':
    highlight_grammar_issues(source, target)
    
    
