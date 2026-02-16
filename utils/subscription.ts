import { AI_REQUEST_FREE_TIER_LIMIT, MAX_FREE_THEMES } from "@/lib/constants";

type Feature = {
  description: string;
  status: "done" | "pending";
};

export const FREE_SUB_FEATURES: Feature[] = [
  { description: "Full theme customization", status: "done" },
  { description: `${AI_REQUEST_FREE_TIER_LIMIT} AI generated themes per day`, status: "done" },
  { description: `Save and share up to ${MAX_FREE_THEMES} themes`, status: "done" },
  { description: "Import theme using CSS variables", status: "done" },
  { description: "Export theme via CSS variables", status: "done" },
  { description: "Export theme via Shadcn Registry Command", status: "done" },
  { description: "Contrast checker", status: "done" },
];
