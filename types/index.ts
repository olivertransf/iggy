export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Course {
  title: string;
  url: string;
  course_num: string;
  subjects: string;
  grade_levels: string;
  length: string;
  type: string;
  uccsu: string;
  prereq: string;
  enroll_criteria: string;
  fulfillment: string;
  description: string;
}

export interface Teacher {
  name: string;
  titles: string;
  departments: string;
  email: string;
  phone: string;
  imageUrl: string;
}
