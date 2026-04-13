import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

const RECEIPT_MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.7;

/**
 * Resizes receipt images (max width, aspect preserved) and re-encodes as JPEG.
 * On web or if manipulation fails, returns the original URI.
 */
export async function compressReceiptForUpload(localUri: string): Promise<string> {
  if (Platform.OS === 'web') {
    return localUri;
  }
  try {
    const result = await ImageManipulator.manipulateAsync(
      localUri,
      [{ resize: { width: RECEIPT_MAX_WIDTH } }],
      {
        compress: JPEG_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return result.uri;
  } catch {
    return localUri;
  }
}
