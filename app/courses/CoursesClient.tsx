"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Course } from "@/types";

interface CoursesClientProps {
  courses: Course[];
}

export default function CoursesClient({ courses: initialCourses }: CoursesClientProps) {
  const [titleFilter, setTitleFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [courseNumFilter, setCourseNumFilter] = useState("");

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.subjects) {
        course.subjects.split(",").forEach((subject) => {
          subjects.add(subject.trim());
        });
      }
    });
    return Array.from(subjects).sort();
  }, [initialCourses]);

  const uniqueGradeLevels = useMemo(() => {
    const gradeLevels = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.grade_levels) {
        course.grade_levels.split(",").forEach((level) => {
          gradeLevels.add(level.trim());
        });
      }
    });
    return Array.from(gradeLevels).sort();
  }, [initialCourses]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.type) {
        course.type.split(",").forEach((type) => {
          types.add(type.trim());
        });
      }
    });
    return Array.from(types).sort();
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesTitle =
        !titleFilter ||
        course.title.toLowerCase().includes(titleFilter.toLowerCase());
      const matchesSubject =
        !subjectFilter ||
        course.subjects.toLowerCase().includes(subjectFilter.toLowerCase());
      const matchesGradeLevel =
        !gradeLevelFilter ||
        course.grade_levels.toLowerCase().includes(gradeLevelFilter.toLowerCase());
      const matchesType =
        !typeFilter ||
        course.type.toLowerCase().includes(typeFilter.toLowerCase());
      const matchesCourseNum =
        !courseNumFilter ||
        course.course_num.toLowerCase().includes(courseNumFilter.toLowerCase());

      return (
        matchesTitle &&
        matchesSubject &&
        matchesGradeLevel &&
        matchesType &&
        matchesCourseNum
      );
    });
  }, [
    initialCourses,
    titleFilter,
    subjectFilter,
    gradeLevelFilter,
    typeFilter,
    courseNumFilter,
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Course Catalog</h1>

      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="title-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title-filter"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="subject-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <select
              id="subject-filter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="grade-level-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grade Level
            </label>
            <select
              id="grade-level-filter"
              value={gradeLevelFilter}
              onChange={(e) => setGradeLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Grade Levels</option>
              {uniqueGradeLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="course-num-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Number
            </label>
            <input
              id="course-num-filter"
              type="text"
              value={courseNumFilter}
              onChange={(e) => setCourseNumFilter(e.target.value)}
              placeholder="Search by course number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {initialCourses.length} courses
        </div>
      </div>

      <div className="space-y-6">
        {filteredCourses.map((course, index) => (
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
