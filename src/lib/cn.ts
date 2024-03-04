import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

https://ui.aceternity.com/components/tailwindcss-buttons
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
