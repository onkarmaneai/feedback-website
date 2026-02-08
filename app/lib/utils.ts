import { SubmissionType } from "@prisma/client";

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function labelType(type: SubmissionType): string {
  return type === "feedback" ? "Feedback" : "Question";
}
