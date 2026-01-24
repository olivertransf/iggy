import json
import re
from typing import List, Dict

def parse_faculty_from_web_content(content: str) -> List[Dict]:
    faculty_list = []
    
    person_pattern = r'(?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z][a-zA-Z\s\'-]+'
    
    sections = re.split(r'(?=' + person_pattern + r'\s+###)', content)
    
    seen_names = set()
    
    for section in sections:
        if not section.strip():
            continue
        
        person = {
            'name': '',
            'class_year': None,
            'titles': [],
            'departments': [],
            'email': '',
            'phone_numbers': []
        }
        
        name_match = re.search(r'^((?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z][a-zA-Z\s\'-]+)', section, re.MULTILINE)
        if not name_match:
            continue
        
        person['name'] = name_match.group(1).strip()
        
        if person['name'] in seen_names:
            continue
        seen_names.add(person['name'])
        
        class_match = re.search(r'Class of (\d{4})', section)
        if class_match:
            person['class_year'] = int(class_match.group(1))
        
        titles_match = re.search(r'\*\*Titles:\*\*\s*([^\*]+?)(?=\*\*Departments:|\*\*Email:|\*\*Phone Numbers:|$)', section, re.DOTALL)
        if titles_match:
            titles_text = titles_match.group(1).strip()
            person['titles'] = [t.strip() for t in titles_text.split(',') if t.strip()]
        
        dept_match = re.search(r'\*\*Departments:\*\*\s*([^\*]+?)(?=\*\*Titles:|\*\*Email:|\*\*Phone Numbers:|$)', section, re.DOTALL)
        if dept_match:
            dept_text = dept_match.group(1).strip()
            person['departments'] = [d.strip() for d in dept_text.split(',') if d.strip()]
        
        email_match = re.search(r'\*\*Email:\*\*\s*([^\*]+?)(?=\*\*Titles:|\*\*Departments:|\*\*Phone Numbers:|$)', section, re.DOTALL)
        if email_match:
            email_text = email_match.group(1).strip()
            if email_text and email_text not in ['Titles:', 'Departments:', 'Phone Numbers:']:
                person['email'] = email_text
        
        phone_matches = re.finditer(r'School:\s*\((\d{3})\)\s*(\d{3})-(\d{4})(?:\s+ext\.\s*(\d+))?', section)
        for phone_match in phone_matches:
            area, first, last, ext = phone_match.groups()
            phone_str = f"({area}) {first}-{last}"
            if ext:
                phone_str += f" ext. {ext}"
            person['phone_numbers'].append({
                'type': 'School',
                'number': phone_str,
                'extension': ext if ext else None
            })
        
        faculty_list.append(person)
    
    return faculty_list

if __name__ == '__main__':
    content = """Mrs. Tonya Addo 

### Mrs. Tonya Addo 

**Titles:** Social Science Teacher, 8th grade Homeroom teacher

**Departments:** Father Sauer Academy

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500   

Ms. Lisa Alexander 

### Ms. Lisa Alexander 

**Titles:** Math Teacher

**Departments:** Mathematics

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 6113  

Mr. Nicholas Alvarado 

### Mr. Nicholas Alvarado 

Class of 2006

**Titles:** Personal & Academic Counselor, Head Cross Country, Assistant Track - Distance

**Departments:** Counseling

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 5718  

Ms. Dinorah Alvarez 

### Ms. Dinorah Alvarez 

**Titles:** Spanish Teacher

**Departments:** Language

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500   

Ms. Melissa Angeles 

### Ms. Melissa Angeles 

**Titles:** Personal & Academic Counselor

**Departments:** Counseling

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 5607  

Mr. Franco Arieta 

### Mr. Franco Arieta 

Class of 1997

**Titles:** Associate Director of Advancement, Alumni

**Departments:** Advancement, NLC Campaign

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 5237  

Mr. David Arnott 

### Mr. David Arnott 

Class of 2001

**Titles:** Communications Manager

**Departments:** Communications

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 5393  

Ms. Maria Balestrieri 

### Ms. Maria Balestrieri 

**Titles:** Administrative Assistant

**Departments:** Adult Spirituality

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500 ext. 5232  

Mr. Jorge Barron 

### Mr. Jorge Barron 

**Titles:** Chef, Kitchen Staff

**Departments:** Food Service

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500   

Jamal Baugh 

### Jamal Baugh 

**Titles:** Director of Athletics and Outreach, Physical Education, Women's Assistant Varsity Coach

**Departments:** Father Sauer Academy

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500   

Ms. Claire Berry 

### Ms. Claire Berry 

**Titles:** Dance Director

**Departments:** Fine Arts

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500   

Mr. Steve Bluford 

### Mr. Steve Bluford 

**Titles:** Buildings and Grounds

**Departments:** Buildings and Grounds

**Email:** 

**Phone Numbers:**  
 School: (415) 731-7500"""
    
    faculty_data = parse_faculty_from_web_content(content)
    
    with open('faculty_directory.json', 'w', encoding='utf-8') as f:
        json.dump(faculty_data, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(faculty_data)} faculty/staff members")
    print(f"Data saved to faculty_directory.json")
    if faculty_data:
        print(f"\nFirst 3 entries:")
        for i, entry in enumerate(faculty_data[:3], 1):
            print(f"\nEntry {i}:")
            print(json.dumps(entry, indent=2, ensure_ascii=False))
