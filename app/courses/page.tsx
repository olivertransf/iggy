import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { Course } from "@/types";

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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Course Catalog</h1>
      <div className="space-y-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {course.url ? (
                    <Link
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {course.title}
                    </Link>
                  ) : (
                    course.title
                  )}
                </h2>
                {course.course_num && (
                  <p className="text-sm text-gray-500">
                    Course #: {course.course_num}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
              {course.subjects && (
                <div>
                  <span className="font-medium text-gray-700">Subjects: </span>
                  <span className="text-gray-600">{course.subjects}</span>
                </div>
              )}
              {course.grade_levels && (
                <div>
                  <span className="font-medium text-gray-700">
                    Grade Levels:{" "}
                  </span>
                  <span className="text-gray-600">{course.grade_levels}</span>
                </div>
              )}
              {course.length && (
                <div>
                  <span className="font-medium text-gray-700">Length: </span>
                  <span className="text-gray-600">{course.length}</span>
                </div>
              )}
              {course.type && (
                <div>
                  <span className="font-medium text-gray-700">Type: </span>
                  <span className="text-gray-600">{course.type}</span>
                </div>
              )}
              {course.uccsu && (
                <div>
                  <span className="font-medium text-gray-700">UCCSU: </span>
                  <span className="text-gray-600">{course.uccsu}</span>
                </div>
              )}
              {course.fulfillment && (
                <div>
                  <span className="font-medium text-gray-700">
                    Fulfillment:{" "}
                  </span>
                  <span className="text-gray-600">{course.fulfillment}</span>
                </div>
              )}
            </div>

            {course.prereq && (
              <div className="mb-3 text-sm">
                <span className="font-medium text-gray-700">
                  Prerequisites:{" "}
                </span>
                <span className="text-gray-600">{course.prereq}</span>
              </div>
            )}

            {course.enroll_criteria && (
              <div className="mb-3 text-sm">
                <span className="font-medium text-gray-700">
                  Enrollment Criteria:{" "}
                </span>
                <span className="text-gray-600">{course.enroll_criteria}</span>
              </div>
            )}

            {course.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
