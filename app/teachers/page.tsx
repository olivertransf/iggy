import { readFileSync } from "fs";
import { join } from "path";
import { Teacher } from "@/types";
import TeachersClient from "./TeachersClient";

function parseCSV(content: string): Teacher[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");
  const data: Teacher[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 6) {
      data.push({
        name: values[0] || "",
        titles: values[1] || "",
        departments: values[2] || "",
        email: values[3] || "",
        phone: values[4] || "",
        imageUrl: values[5] || "",
      });
    }
  }

  return data;
}

export default function TeachersPage() {
  const filePath = join(process.cwd(), "public", "faculty_directory_complete.csv");
  const fileContent = readFileSync(filePath, "utf-8");
  const teachers = parseCSV(fileContent);

  return <TeachersClient teachers={teachers} />;
}
