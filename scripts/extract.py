import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlunparse, urlencode, parse_qsl
import pandas as pd
import re

START = "https://curriculum.siprep.org/courses-list/?subjects=&grade_levels=&length=&type=&uccsu=&course_s=&submit=Update"

def clean_query(qs: str) -> str:
    # Keep only the expected keys; drop junk like "Updatehttps%3A%2F%2F..."
    allowed = {"subjects","grade_levels","length","type","uccsu","course_s","submit"}
    pairs = [(k,v) for (k,v) in parse_qsl(qs, keep_blank_values=True) if k in allowed]
    # force submit=Update
    pairs = [(k,v) for (k,v) in pairs if k != "submit"] + [("submit","Update")]
    return urlencode(pairs, doseq=True)

u = urlparse(START)
query = clean_query(u.query)

rows = []
page = 1
while True:
    if page == 1:
        path = "/courses-list/"
    else:
        path = f"/courses-list/page/{page}/"

    url = urlunparse((u.scheme, u.netloc, path, "", query, ""))

    html = requests.get(url, timeout=30).text
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.select("article.courses")
    if not articles:
        break

    for art in articles:
        title_a = art.select_one("h1.entry-title a")
        title = title_a.get_text(strip=True) if title_a else None
        link = title_a["href"] if title_a else None

        meta = {}
        for div in art.select(".course-meta > div"):
            key = (div.get("class") or ["unknown"])[0]
            label = div.select_one(".label")
            txt = div.get_text(" ", strip=True)
            if label:
                txt = txt.replace(label.get_text(strip=True), "", 1).strip(" :")
            meta[key] = txt

        desc = art.select_one(".entry-content")
        description = None
        if desc:
            description = desc.get_text(" ", strip=True)
            description = re.sub(r'\s+', ' ', description)
            description = description.strip()

        def clean_text(text):
            if not text:
                return None
            text = re.sub(r'\s+', ' ', text)
            return text.strip()

        rows.append({
            "title": clean_text(title),
            "url": link,
            "course_num": clean_text(meta.get("course_num")),
            "subjects": clean_text(meta.get("subjects")),
            "grade_levels": clean_text(meta.get("grade_levels")),
            "length": clean_text(meta.get("length")),
            "type": clean_text(meta.get("type")),
            "uccsu": clean_text(meta.get("uccsu")),
            "prereq": clean_text(meta.get("prereq")),
            "enroll_criteria": clean_text(meta.get("enroll-criteria")),
            "fulfillment": clean_text(meta.get("fulfillment")),
            "description": description,
        })

    page += 1

df = pd.DataFrame(rows)
output_file = "courses_data.csv"
df.to_csv(output_file, index=False, quoting=1, escapechar=None)
print(f"Extracted {len(rows)} courses and saved to {output_file}")
