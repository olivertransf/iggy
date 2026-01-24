import json
import re
from typing import List, Dict

def parse_faculty_directory(content: str) -> List[Dict]:
    faculty_list = []
    
    person_blocks = re.split(r'\n\n(?=(?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z])', content)
    
    for block in person_blocks:
        if not block.strip():
            continue
        
        person = {
            'name': '',
            'class_year': None,
            'titles': [],
            'departments': [],
            'email': '',
            'phone_numbers': []
        }
        
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        
        for i, line in enumerate(lines):
            if i == 0 or (i == 1 and line.startswith('###')):
                name_match = re.match(r'^(?:###\s+)?((?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z][a-zA-Z\s\'-]+)', line)
                if name_match:
                    person['name'] = name_match.group(1).strip()
                    
                    class_match = re.search(r'Class of (\d{4})', block)
                    if class_match:
                        person['class_year'] = int(class_match.group(1))
                continue
            
            if line.startswith('**Titles:**'):
                titles_text = line.replace('**Titles:**', '').strip()
                if not titles_text and i + 1 < len(lines):
                    titles_text = lines[i + 1].strip()
                if titles_text:
                    person['titles'] = [t.strip() for t in titles_text.split(',') if t.strip()]
            
            elif line.startswith('**Departments:**'):
                dept_text = line.replace('**Departments:**', '').strip()
                if not dept_text and i + 1 < len(lines):
                    dept_text = lines[i + 1].strip()
                if dept_text:
                    person['departments'] = [d.strip() for d in dept_text.split(',') if d.strip()]
            
            elif line.startswith('**Email:**'):
                email_text = line.replace('**Email:**', '').strip()
                if not email_text and i + 1 < len(lines) and not lines[i + 1].startswith('**'):
                    email_text = lines[i + 1].strip()
                if email_text and email_text not in ['Titles:', 'Departments:', 'Phone Numbers:']:
                    person['email'] = email_text
            
            elif 'School:' in line and '(' in line:
                phone_match = re.search(r'\((\d{3})\)\s*(\d{3})-(\d{4})(?:\s+ext\.\s*(\d+))?', line)
                if phone_match:
                    area, first, last, ext = phone_match.groups()
                    phone_str = f"({area}) {first}-{last}"
                    if ext:
                        phone_str += f" ext. {ext}"
                    person['phone_numbers'].append({
                        'type': 'School',
                        'number': phone_str,
                        'extension': ext if ext else None
                    })
        
        if person['name']:
            faculty_list.append(person)
    
    return faculty_list

if __name__ == '__main__':
    with open('faculty_content.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    faculty_data = parse_faculty_directory(content)
    
    with open('faculty_directory.json', 'w', encoding='utf-8') as f:
        json.dump(faculty_data, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(faculty_data)} faculty/staff members")
    print(f"Data saved to faculty_directory.json")
    if faculty_data:
        print(f"\nFirst entry sample:")
        print(json.dumps(faculty_data[0], indent=2, ensure_ascii=False))
