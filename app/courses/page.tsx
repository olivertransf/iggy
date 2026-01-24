import { readFileSync } from "fs";
import { join } from "path";
import { Course } from "@/types";
import CoursesClient from "./CoursesClient";

function parseCSV(content: string): Course[] {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if (char === "\n" && !inQuotes) {
      lines.push(currentLine);
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",");
  const data: Course[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 12) {
      data.push({
        title: values[0]?.replace(/^"|"$/g, "") || "",
        url: values[1]?.replace(/^"|"$/g, "") || "",
        course_num: values[2]?.replace(/^"|"$/g, "") || "",
        subjects: values[3]?.replace(/^"|"$/g, "") || "",
        grade_levels: values[4]?.replace(/^"|"$/g, "") || "",
        length: values[5]?.replace(/^"|"$/g, "") || "",
        type: values[6]?.replace(/^"|"$/g, "") || "",
        uccsu: values[7]?.replace(/^"|"$/g, "") || "",
        prereq: values[8]?.replace(/^"|"$/g, "") || "",
        enroll_criteria: values[9]?.replace(/^"|"$/g, "") || "",
        fulfillment: values[10]?.replace(/^"|"$/g, "") || "",
        description: values[11]?.replace(/^"|"$/g, "") || "",
      });
    }
  }

  return data;
}

export default function CoursesPage() {
  const filePath = join(process.cwd(), "public", "courses_data.csv");
  const fileContent = readFileSync(filePath, "utf-8");
  const courses = parseCSV(fileContent);

  return <CoursesClient courses={courses} />;
}
