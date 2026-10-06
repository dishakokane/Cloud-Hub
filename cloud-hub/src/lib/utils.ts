import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely convert a Firestore Timestamp / Date / number / string to a Date.
 * Returns null if the value is missing or invalid (e.g. pending serverTimestamp()).
 */
export function toDateSafe(value: unknown): Date | null {
  if (!value) return null;
  // Firestore Timestamp
  if (typeof (value as any).toDate === "function") {
    try {
      return (value as any).toDate();
    } catch {
      return null;
    }
  }
  // Native Date
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  // Object with seconds (raw Firestore timestamp shape)
  if (typeof value === "object" && value !== null && "seconds" in (value as any)) {
    const seconds = Number((value as any).seconds);
    if (!isNaN(seconds)) return new Date(seconds * 1000);
  }
  // Number / string
  const d = new Date(value as string | number);
  return isNaN(d.getTime()) ? null : d;
}
