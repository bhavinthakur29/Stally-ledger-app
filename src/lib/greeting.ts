export type TimeGreeting = {
  greeting: string;
  emoji: string;
};

/**
 * Local-time greeting + avatar emoji.
 * 5:00–12:00 morning, 12:00–17:00 afternoon, 17:00–21:00 evening, 21:00–5:00 night.
 */
export function getTimeGreeting(date = new Date()): TimeGreeting {
  const h = date.getHours();

  if (h >= 5 && h < 12) {
    return { greeting: 'Good morning', emoji: '🌅' };
  }
  if (h >= 12 && h < 17) {
    return { greeting: 'Good afternoon', emoji: '☀️' };
  }
  if (h >= 17 && h < 21) {
    return { greeting: 'Good evening', emoji: '🌇' };
  }
  return { greeting: 'Good evening', emoji: '🌙' };
}

/** @deprecated Prefer `getTimeGreeting().greeting` for new UI. */
export function getTimeOfDayGreeting(date = new Date()): string {
  return getTimeGreeting(date).greeting;
}
