import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// https://ui.aceternity.com/components/tailwindcss-buttons
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs))
}
