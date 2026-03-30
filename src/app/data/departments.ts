const DEPARTMENTS_BY_COURSE: Record<string, string[]> = {
  "BS Information Technology": [
    "Software Development",
    "Web Development",
    "Mobile Development",
    "QA / Testing",
    "IT Support",
    "Systems Administration",
    "Network Operations",
    "Cybersecurity",
  ],
  "BS Computer Science": [
    "Software Engineering",
    "Data Engineering",
    "Machine Learning",
    "Research and Development",
    "Backend Development",
    "QA / Testing",
  ],
  "BS Information Systems": [
    "Business Systems",
    "Systems Analysis",
    "ERP Support",
    "Project Management Office",
    "Data Analytics",
  ],
  "BS Computer Engineering": [
    "Embedded Systems",
    "Hardware Engineering",
    "Network Engineering",
    "Technical Operations",
  ],
  "BS Business Administration": [
    "Operations",
    "Human Resources",
    "Finance",
    "Sales",
    "Marketing",
  ],
  "BS Accountancy": [
    "Accounting",
    "Audit",
    "Tax Compliance",
    "Finance",
  ],
};

const DEFAULT_DEPARTMENTS = [
  "Software Development",
  "QA / Testing",
  "IT Support",
  "Operations",
  "Human Resources",
  "Marketing",
  "Finance",
  "Administrative",
];

export function getDepartmentOptionsByCourse(course: string): string[] {
  const exact = DEPARTMENTS_BY_COURSE[course];
  if (exact) return exact;

  if (!course.trim()) return DEFAULT_DEPARTMENTS;

  const lower = course.toLowerCase();
  if (lower.includes("computer") || lower.includes("information") || lower.includes("software") || lower.includes("data")) {
    return [
      "Software Development",
      "Web Development",
      "QA / Testing",
      "IT Support",
      "Network Operations",
      "Data Analytics",
    ];
  }

  return DEFAULT_DEPARTMENTS;
}