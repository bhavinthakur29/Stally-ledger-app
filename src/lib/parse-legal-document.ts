export type LegalBlock = {
  /** Empty for preamble before first numbered section. */
  heading: string;
  body: string;
};

/**
 * Splits `LegalContent` strings where sections start with `## N. Title` at the beginning of a line.
 */
export function parseLegalDocument(raw: string): LegalBlock[] {
  const trimmed = raw.trim();
  const chunks = trimmed.split(/\n(?=## \d+\.\s)/);
  const blocks: LegalBlock[] = [];

  for (const chunk of chunks) {
    const c = chunk.trim();
    if (!c) continue;
    const lines = c.split('\n');
    const first = lines[0];
    const hm = first.match(/^## (\d+)\.\s+(.+)$/);
    if (hm) {
      blocks.push({
        heading: `${hm[1]}. ${hm[2]}`,
        body: lines.slice(1).join('\n').trim(),
      });
    } else {
      blocks.push({ heading: '', body: c });
    }
  }

  return blocks;
}
