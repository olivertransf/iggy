import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from datetime import datetime
import json

URL = "https://families.siprep.org/daily-life/food-service"

def scrape_menu():
    print(f"Fetching menu from {URL}...")
    response = requests.get(URL, timeout=30)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    menu_items = []
    
    menu_section = soup.find("h2", string=re.compile("Student Hot Lunch Menu", re.I))
    if not menu_section:
        print("Warning: Could not find menu section")
        return None
    
    parent = menu_section.find_parent()
    if not parent:
        parent = menu_section
    
    days = ["Mon", "Tues", "Wed", "Thurs", "Fri"]
    
    for heading in parent.find_all_next(["h2", "h3", "h4"]):
        text = heading.get_text(strip=True)
        
        for day in days:
            if text.startswith(day):
                date_match = re.search(r'(\d{1,2}/\d{1,2})', text)
                if date_match:
                    date = date_match.group(1)
                    
                    menu_text = ""
                    next_elem = heading.find_next_sibling()
                    
                    if next_elem:
                        menu_text = next_elem.get_text(strip=True)
                        if not menu_text or len(menu_text) < 5:
                            next_elem = next_elem.find_next_sibling()
                            if next_elem:
                                menu_text = next_elem.get_text(strip=True)
                    
                    if not menu_text:
                        menu_text = text.replace(day, "").strip()
                        menu_text = re.sub(r'^\d{1,2}/\d{1,2}\s*', '', menu_text).strip()
                    
                    if menu_text and len(menu_text) > 3:
                        menu_items.append({
                            "day": day,
                            "date": date,
                            "menu": menu_text
                        })
                break
    
    if not menu_items:
        print("Warning: No menu items found. Trying alternative parsing...")
        all_text = soup.get_text()
        for day in days:
            pattern = rf'{day}\s+(\d{{1,2}}/\d{{1,2}})\s*\n\s*([^\n]+)'
            matches = re.finditer(pattern, all_text, re.MULTILINE)
            for match in matches:
                date = match.group(1)
                menu = match.group(2).strip()
                if menu and len(menu) > 3:
                    menu_items.append({
                        "day": day,
                        "date": date,
                        "menu": menu
                    })
    
    if not menu_items:
        print("Error: Could not extract menu items")
        print("Page content preview:")
        print(soup.get_text()[:500])
        return None
    
    df = pd.DataFrame(menu_items)
    
    csv_file = "public/lunch_menu.csv"
    df.to_csv(csv_file, index=False)
    print(f"Saved {len(menu_items)} menu items to {csv_file}")
    
    json_file = "public/lunch_menu.json"
    with open(json_file, "w") as f:
        json.dump(menu_items, f, indent=2)
    print(f"Saved menu to {json_file}")
    
    print("\nMenu extracted:")
    for item in menu_items:
        print(f"  {item['day']} {item['date']}: {item['menu']}")
    
    return menu_items

if __name__ == "__main__":
    try:
        scrape_menu()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
