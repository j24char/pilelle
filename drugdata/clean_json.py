# Usage: python .\clean_json.py

import json
import os

print("Current directory:", os.getcwd())

# List of phrases to look for to be removed in keys
target_phrases = [
    "Drug_Dose",
    "Dosage_Form",
    "Dose",
    "Time",
    "Experimental_Species",
    "Experimental_Design",
    "Experimental_Individuals_Number",
    "Test_Method",
    "Test_Sample",
    "Potential_Target",
    "Target_ID",
    "PMID",
    "DOI"
]

def clean_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    cleaned = []
    for entry in data:
        filtered = {k: v for k, v in entry.items() if not any(phrase in k for phrase in target_phrases)}
        cleaned.append(filtered)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

clean_json('interactions.json', 'interactions_cleaned.json')