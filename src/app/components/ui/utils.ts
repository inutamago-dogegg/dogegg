import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getImage } from "astro:assets";

export async function optimize(src: string, width: number = 64, height: number = 64) {
  return await getImage({ src, width, height, format: "webp" });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
