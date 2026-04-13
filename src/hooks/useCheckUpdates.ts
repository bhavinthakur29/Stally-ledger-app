import * as Application from 'expo-application';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';

const VERSION_JSON_URL = 'https://teksquad.netlify.app/apps/tektally/version.json';
const UPDATE_PAGE_URL = 'https://teksquad.netlify.app/apps/tektally';

/** Expected shape of hosted `version.json` (TekSquad site). */
export type RemoteVersionPayload = {
  versionCode: number;
  latestVersion: string;
  releaseNotes: string;
};

function parseVersionCode(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * On production cold start, compares `Application.nativeBuildVersion` to remote `versionCode`
 * and prompts the user when a newer build is published.
 */
export function useCheckUpdates() {
  useEffect(() => {
    if (__DEV__) {
      return;
    }

    let cancelled = false;

    async function run() {
      const currentRaw = Application.nativeBuildVersion;
      if (currentRaw == null || currentRaw === '') {
        return;
      }

      const currentCode = parseInt(currentRaw, 10);
      if (!Number.isFinite(currentCode)) {
        return;
      }

      try {
        const res = await fetch(VERSION_JSON_URL, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok || cancelled) {
          return;
        }

        const data = (await res.json()) as Partial<RemoteVersionPayload>;
        const remoteCode = parseVersionCode(data.versionCode);
        if (remoteCode == null || cancelled) {
          return;
        }

        if (remoteCode <= currentCode) {
          return;
        }

        const latestVersion =
          typeof data.latestVersion === 'string' ? data.latestVersion.trim() : '';
        const releaseNotes =
          typeof data.releaseNotes === 'string' ? data.releaseNotes.trim() : '';

        if (cancelled) {
          return;
        }

        const lines: string[] = [];
        if (latestVersion) {
          lines.push(`Latest version: ${latestVersion}`);
        }
        if (releaseNotes) {
          lines.push(releaseNotes);
        }
        const message = lines.length > 0 ? lines.join('\n\n') : 'A newer version is available.';

        Alert.alert('Update Available', message, [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Update Now',
            onPress: () => {
              void Linking.openURL(UPDATE_PAGE_URL);
            },
          },
        ]);
      } catch {
        // Network or JSON errors: fail silently in production
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);
}
