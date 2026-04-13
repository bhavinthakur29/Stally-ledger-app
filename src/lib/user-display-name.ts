import type { User } from 'firebase/auth';

/** First name or email local-part for "Hello, …" lines. */
export function getUserGreetingName(user: User | null): string {
  if (!user) return 'there';
  const display = user.displayName?.trim();
  if (display) {
    const first = display.split(/\s+/)[0];
    if (first) return first;
  }
  const email = user.email?.split('@')[0]?.trim();
  if (email) return email;
  return 'there';
}
