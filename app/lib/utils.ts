import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date and optional time string into a human-readable format
 * Example: March 18, 2026 @ 12:00 AM
 */
export function formatDateTime(dateStr?: string | null, timeStr?: string | null) {
  if (!dateStr) return 'No date set'

  const date = new Date(dateStr)
  
  // Format the date part (e.g., March 18, 2026)
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)

  if (!timeStr) return dateFormatted

  // Handle various time formats (e.g., "14:30:00" or ISO strings)
  // If timeStr is a full ISO string, we extract only the time
  let timeToParse = timeStr
  if (timeStr.includes('T')) {
    timeToParse = timeStr.split('T')[1].split('.')[0]
  }

  // Create a temporary date to parse the time
  const [hours, minutes] = timeToParse.split(':').map(Number)
  const dummyDate = new Date()
  dummyDate.setHours(hours || 0, minutes || 0, 0, 0)

  const timeFormatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dummyDate)

  return `${dateFormatted} @ ${timeFormatted}`
}
