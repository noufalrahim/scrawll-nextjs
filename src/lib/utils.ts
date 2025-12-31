import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TNote } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colSpanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

export const withNA = (value: string | number | undefined) => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string" && value.trim() === "") return "N/A";
  return value;
};

export function buildTree(notes: any[]) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  for (const note of notes) {
    map.set(note.id.toString(), { ...note, children: [] });
  }

  for (const note of notes) {
    if (note.parent) {
      const parent = map.get(note.parent.toString());
      if (parent) {
        parent.children.push(map.get(note.id.toString()));
      }
    } else {
      roots.push(map.get(note.id.toString()));
    }
  }

  return roots;
}
