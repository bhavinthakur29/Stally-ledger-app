/** Local-time greeting for the current day period (title case for UI). */
export function getTimeOfDayGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  return 'Good Evening';
}
