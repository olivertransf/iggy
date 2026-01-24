"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Teacher } from "@/types";

interface TeachersClientProps {
  teachers: Teacher[];
}

export default function TeachersClient({ teachers: initialTeachers }: TeachersClientProps) {
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Faculty Directory</h1>

      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="name-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="department-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <select
              id="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredTeachers.length} of {initialTeachers.length} teachers
        </div>
      </div>

      <ul className="space-y-4">
        {filteredTeachers.map((teacher, index) => (
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
