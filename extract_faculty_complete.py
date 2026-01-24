import json
import re
import urllib.request
import urllib.error
import html
from typing import List, Dict

def fetch_faculty_directory(url: str) -> str:
    """Fetch the faculty directory page content"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return ""

def parse_faculty_from_html(html_content: str) -> List[Dict]:
    """Parse faculty data from HTML content using regex"""
    faculty_list = []
    
    person_pattern = r'<h3[^>]*>.*?((?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z][a-zA-Z\s\'-]+).*?</h3>'
    
    person_blocks = re.finditer(
        r'<h3[^>]*>(.*?)</h3>(.*?)(?=<h3[^>]*>|$)',
        html_content,
        re.DOTALL
    )
    
    for match in person_blocks:
        h3_content = match.group(1)
        details_content = match.group(2)
        
        person = {
            'name': '',
            'class_year': None,
            'titles': [],
            'departments': [],
            'email': '',
            'phone_numbers': []
        }
        
        name_match = re.search(r'((?:Mrs\.|Ms\.|Mr\.|Jamal|Rick|Kevin|Andrew|Christopher|Sandrine|Selene|Rachel)\s+[A-Z][a-zA-Z\s\'-]+)', h3_content)
        if not name_match:
            continue
        
        person['name'] = name_match.group(1).strip()
        
        class_match = re.search(r'<div[^>]*class="fsClassOf"[^>]*>Class of (\d{4})</div>', details_content, re.IGNORECASE)
        if class_match:
            person['class_year'] = int(class_match.group(1))
        
        titles_match = re.search(r'<strong[^>]*>Titles:</strong>\s*(.+?)(?=<strong|<p|$)', details_content, re.DOTALL | re.IGNORECASE)
        if titles_match:
            titles_html = titles_match.group(1)
            titles_text = html.unescape(re.sub(r'<[^>]+>', '', titles_html)).strip()
            if titles_text:
                person['titles'] = [t.strip() for t in titles_text.split(',') if t.strip()]
        
        dept_match = re.search(r'<strong[^>]*>Departments:</strong>\s*(.+?)(?=<strong|<p|$)', details_content, re.DOTALL | re.IGNORECASE)
        if dept_match:
            dept_html = dept_match.group(1)
            dept_text = html.unescape(re.sub(r'<[^>]+>', '', dept_html)).strip()
            if dept_text:
                person['departments'] = [d.strip() for d in dept_text.split(',') if d.strip()]
        
        email_match = re.search(r'<strong[^>]*>Email:</strong>\s*(.+?)(?=<strong|<p|$)', details_content, re.DOTALL | re.IGNORECASE)
        if email_match:
            email_html = email_match.group(1)
            email_text = html.unescape(re.sub(r'<[^>]+>', '', email_html)).strip()
            if email_text and email_text not in ['Titles:', 'Departments:', 'Phone Numbers:']:
                person['email'] = email_text
        
        phone_section = re.search(r'<strong[^>]*>Phone Numbers:</strong>\s*(.+?)(?=<strong|<p|$)', details_content, re.DOTALL | re.IGNORECASE)
        if phone_section:
            phone_html = phone_section.group(1)
            phone_text = html.unescape(re.sub(r'<[^>]+>', ' ', phone_html))
            phone_matches = re.finditer(r'School:\s*\((\d{3})\)\s*(\d{3})-(\d{4})(?:\s+ext\.\s*(\d+))?', phone_text)
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
        
        if person['name']:
            faculty_list.append(person)
    
    return faculty_list

def parse_faculty_from_text(content: str) -> List[Dict]:
    """Parse faculty data from text content"""
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
    url = 'https://www.siprep.org/faculty-directory'
    
    print("Fetching faculty directory from URL...")
    html_content = fetch_faculty_directory(url)
    
    if html_content:
        print("Parsing HTML content...")
        faculty_data = parse_faculty_from_html(html_content)
        print(f"Extracted {len(faculty_data)} faculty/staff members from HTML")
    else:
        print("Failed to fetch from URL. Trying to parse from text file...")
        try:
            with open('faculty_content.txt', 'r', encoding='utf-8') as f:
                content = f.read()
            faculty_data = parse_faculty_from_text(content)
            print(f"Extracted {len(faculty_data)} faculty/staff members from text file")
        except FileNotFoundError:
            print("No text file found. Please provide faculty_content.txt or ensure network access.")
            faculty_data = []
    
    if faculty_data:
        with open('faculty_directory.json', 'w', encoding='utf-8') as f:
            json.dump(faculty_data, f, indent=2, ensure_ascii=False)
        
        print(f"\nData saved to faculty_directory.json")
        print(f"\nFirst 3 entries:")
        for i, entry in enumerate(faculty_data[:3], 1):
            print(f"\nEntry {i}:")
            print(json.dumps(entry, indent=2, ensure_ascii=False))
    else:
        print("No faculty data extracted")
