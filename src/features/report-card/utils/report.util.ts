export function getGrade(marks: number): string {
  if (marks >= 90) return "A+";
  else if (marks >= 80) return "A";
  else if (marks >= 70) return "B";
  else if (marks >= 60) return "C";
  else if (marks >= 50) return "D";
  else return "";
}

export function gradeToMark(grade: string | number | undefined): number {
  if (grade === undefined || grade === null || grade === "") return 0;
  if (typeof grade === "number") return grade; // already numeric

  switch (grade.toUpperCase()) {
    case "A+": return 95; // numeric representation for A+
    case "A": return 85;
    case "B": return 75;
    case "C": return 65;
    case "D": return 55;
    default: return 0; // empty or unknown grade
  }
}
