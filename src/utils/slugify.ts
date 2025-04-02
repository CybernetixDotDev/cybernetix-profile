// utils/slugify.ts
export function slugifyUsername(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]+/g, '-') // Replace non-alphanumerics with dash
      .replace(/^-+|-+$/g, '')       // Remove leading/trailing dashes
  }
  