import { readFileSync } from "fs";
import { join } from "path";
import Image from "next/image";
import { Teacher } from "@/types";

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Faculty Directory</h1>
      <ul className="space-y-4">
        {teachers.map((teacher, index) => (
          <li key={index} className="border-b border-gray-200 pb-4">
            <div className="flex gap-4">
              {teacher.imageUrl && (
                <div className="flex-shrink-0">
                  <Image 
                    src={teacher.imageUrl} 
                    alt={teacher.name} 
                    width={100} 
                    height={100}
                    className="rounded object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{teacher.name}</h2>
                {teacher.titles && (
                  <p className="text-sm text-gray-600">{teacher.titles}</p>
                )}
                {teacher.departments && (
                  <p className="text-sm text-gray-500">{teacher.departments}</p>
                )}
                {teacher.email && (
                  <p className="text-sm text-blue-600">{teacher.email}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
