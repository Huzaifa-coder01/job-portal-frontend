export const profileChecklist = (user) => [
  { label: "Add a headline", done: Boolean(user.headline) },
  { label: "Set your location", done: Boolean(user.location) },
  { label: "Write a short bio", done: Boolean(user.bio) },
  { label: "List at least 3 skills", done: (user.skills?.length ?? 0) >= 3 },
  { label: "Add work experience", done: (user.experience?.length ?? 0) >= 1 },
  { label: "Upload your resume", done: Boolean(user.resumeName) },
];
