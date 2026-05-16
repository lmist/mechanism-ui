import { useCallback, useEffect, useState } from 'react';

export interface UseCopyToClipboardOptions {
  /** Milliseconds before `copied` resets to false. Defaults to 1200. */
  resetMs?: number;
}

/**
 * Headless copy-to-clipboard button state.
 *
 * Returns a memoized `buttonProps` bundle and a derived `label`.
 * The consumer only renders markup and picks the styling.
 */
export function useCopyToClipboard(text: string, { resetMs = 1200 }: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), resetMs);
    return () => window.clearTimeout(id);
  }, [copied, resetMs]);

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
  }, [text]);

  return {
    copied,
    label: copied ? 'COPIED' : 'COPY',
    buttonProps: { type: 'button' as const, onClick: copy },
  };
}
