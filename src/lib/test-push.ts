/**
 * Sends a remote push via Expo's push service (same path production backends use).
 * Requires a valid Expo push token from the device.
 */
export async function sendTestPushHelloFromStally(expoPushToken: string): Promise<void> {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      title: 'Stally',
      body: 'Hello from Stally!',
      sound: 'default',
      priority: 'high',
      channelId: 'default',
    }),
  });

  const payload = (await response.json()) as {
    data?: { status?: string; id?: string; message?: string } | Array<{ status?: string; message?: string }>;
    errors?: { code?: string; message?: string }[];
  };

  if (!response.ok) {
    throw new Error(payload.errors?.[0]?.message ?? `Push failed (${response.status})`);
  }
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? 'Expo push returned an error');
  }
  const ticket = Array.isArray(payload.data) ? payload.data[0] : payload.data;
  if (ticket?.status === 'error') {
    throw new Error(ticket.message ?? 'Expo push ticket error');
  }
}
