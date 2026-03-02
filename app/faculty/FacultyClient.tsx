"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Teacher } from "@/types";

interface FacultyClientProps {
  teachers: Teacher[];
}

export default function FacultyClient({ teachers: initialTeachers }: FacultyClientProps) {
  const [nameFilter, setNameFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const uniqueDepartments = useMemo(() => {
    const departments = new Set<string>();
    initialTeachers.forEach((teacher) => {
      if (teacher.departments) {
        teacher.departments.split(",").forEach((dept) => {
          departments.add(dept.trim());
        });
      }
    });
    return Array.from(departments).sort();
  }, [initialTeachers]);

  const filteredTeachers = useMemo(() => {
    return initialTeachers.filter((teacher) => {
      const matchesName =
        !nameFilter ||
        teacher.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesDepartment =
        !departmentFilter ||
        teacher.departments
          .toLowerCase()
          .includes(departmentFilter.toLowerCase());
      const matchesTitle =
        !titleFilter ||
        teacher.titles.toLowerCase().includes(titleFilter.toLowerCase());

      return matchesName && matchesDepartment && matchesTitle;
    });
  }, [initialTeachers, nameFilter, departmentFilter, titleFilter]);

  return (
    <div className="page-main">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">Faculty</h1>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Name</label>
            <input
              id="name-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name..."
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="department-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Department</label>
            <select
              id="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="title-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Title</label>
            <input
              id="title-filter"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search by title..."
              className="input-base"
            />
          </div>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {filteredTeachers.length} of {initialTeachers.length} faculty
        </div>
      </div>

      <ul className="space-y-4 divide-y divide-neutral-200 dark:divide-neutral-800">
        {filteredTeachers.map((teacher, index) => (
          <li key={index} className="pt-5 first:pt-0">
            <div className="flex gap-4">
              {teacher.imageUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className="font-medium text-neutral-900 dark:text-neutral-100">{teacher.name}</h2>
                {teacher.titles && <p className="text-sm text-neutral-600 dark:text-neutral-400">{teacher.titles}</p>}
                {teacher.departments && <p className="text-sm text-neutral-500 dark:text-neutral-400">{teacher.departments}</p>}
                {teacher.email && (
                  <a href={`mailto:${teacher.email}`} className="text-sm text-[#A71930] dark:text-sky-400 hover:underline dark:hover:text-sky-300">
                    {teacher.email}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
