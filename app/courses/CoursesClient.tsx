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
    <div className="page-main">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">Courses</h1>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="title-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Title</label>
            <input
              id="title-filter"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search..."
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="subject-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Subject</label>
            <select
              id="subject-filter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="input-base"
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
            <label htmlFor="grade-level-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Grade</label>
            <select
              id="grade-level-filter"
              value={gradeLevelFilter}
              onChange={(e) => setGradeLevelFilter(e.target.value)}
              className="input-base"
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
            <label htmlFor="type-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Type</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-base"
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
            <label htmlFor="course-num-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Course #</label>
            <input
              id="course-num-filter"
              type="text"
              value={courseNumFilter}
              onChange={(e) => setCourseNumFilter(e.target.value)}
              placeholder="Search..."
              className="input-base"
            />
          </div>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {filteredCourses.length} of {initialCourses.length} courses
        </div>
      </div>

      <div className="space-y-5">
        {filteredCourses.map((course, index) => (
          <div key={index} className="card p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {course.url ? (
                  <Link
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A71930] dark:text-sky-400 hover:underline dark:hover:text-sky-300"
                  >
                    {course.title}
                  </Link>
                ) : (
                  course.title
                )}
              </h2>
              {course.course_num && (
                <p className="text-base text-neutral-500 dark:text-neutral-400 mt-1">{course.course_num}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-base">
              {course.subjects && (
                <div><span className="text-neutral-500 dark:text-neutral-400">Subjects: </span><span className="text-neutral-700 dark:text-neutral-300">{course.subjects}</span></div>
              )}
              {course.grade_levels && (
                <div><span className="text-neutral-500 dark:text-neutral-400">Grade: </span><span className="text-neutral-700 dark:text-neutral-300">{course.grade_levels}</span></div>
              )}
              {course.length && (
                <div><span className="text-neutral-500 dark:text-neutral-400">Length: </span><span className="text-neutral-700 dark:text-neutral-300">{course.length}</span></div>
              )}
              {course.type && (
                <div><span className="text-neutral-500 dark:text-neutral-400">Type: </span><span className="text-neutral-700 dark:text-neutral-300">{course.type}</span></div>
              )}
              {course.uccsu && (
                <div><span className="text-neutral-500 dark:text-neutral-400">UCCSU: </span><span className="text-neutral-700 dark:text-neutral-300">{course.uccsu}</span></div>
              )}
              {course.fulfillment && (
                <div><span className="text-neutral-500 dark:text-neutral-400">Fulfillment: </span><span className="text-neutral-700 dark:text-neutral-300">{course.fulfillment}</span></div>
              )}
            </div>

            {course.prereq && (
              <div className="mb-2 text-base"><span className="text-neutral-500 dark:text-neutral-400">Prereq: </span><span className="text-neutral-700 dark:text-neutral-300">{course.prereq}</span></div>
            )}
            {course.enroll_criteria && (
              <div className="mb-2 text-base"><span className="text-neutral-500 dark:text-neutral-400">Enroll: </span><span className="text-neutral-700 dark:text-neutral-300">{course.enroll_criteria}</span></div>
            )}
            {course.description && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{course.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
