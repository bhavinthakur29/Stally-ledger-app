/**
 * Injects Firebase client config from environment (EAS secrets / local .env).
 * Never commit real keys; copy `.env.example` → `.env` for local dev.
 */
module.exports = ({ config }) => {
  const fromEnv = {
    apiKey: process.env.EXPO_PUBLIC_FB_API_KEY ?? '',
    authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN ?? '',
    projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID ?? '',
    storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID ?? '',
    appId: process.env.EXPO_PUBLIC_FB_APP_ID ?? '',
  };

  const envComplete =
    Boolean(fromEnv.apiKey) &&
    Boolean(fromEnv.authDomain) &&
    Boolean(fromEnv.projectId) &&
    Boolean(fromEnv.storageBucket) &&
    Boolean(fromEnv.messagingSenderId) &&
    Boolean(fromEnv.appId);

  const firebase = envComplete ? fromEnv : (config.extra?.firebase ?? fromEnv);

  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      firebase,
    },
  };
};
