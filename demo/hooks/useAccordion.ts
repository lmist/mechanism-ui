import { useCallback, useMemo, useState } from 'react';

export type AccordionMode = 'single' | 'multiple';

export interface UseAccordionOptions {
  /** "single" allows one item open at a time; "multiple" allows any. Defaults to "single". */
  mode?: AccordionMode;
  /** Controlled set of open indices. Omit for uncontrolled. */
  openIndices?: ReadonlySet<number>;
  /** Called whenever the set of open indices changes. */
  onOpenIndicesChange?: (open: ReadonlySet<number>) => void;
  /** Initial open indices when uncontrolled. */
  defaultOpen?: ReadonlyArray<number>;
}

/**
 * Headless accordion. Supports single or multiple expand modes and
 * controlled / uncontrolled state.
 */
export function useAccordion({
  mode = 'single',
  openIndices: controlled,
  onOpenIndicesChange,
  defaultOpen = [],
}: UseAccordionOptions = {}) {
  const [internal, setInternal] = useState<ReadonlySet<number>>(() => new Set(defaultOpen));
  const isControlled = controlled !== undefined;
  const openIndices = isControlled ? controlled : internal;

  const commit = useCallback(
    (next: ReadonlySet<number>) => {
      if (!isControlled) setInternal(next);
      onOpenIndicesChange?.(next);
    },
    [isControlled, onOpenIndicesChange],
  );

  const toggle = useCallback(
    (index: number) => {
      const next = new Set(openIndices);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (mode === 'single') next.clear();
        next.add(index);
      }
      commit(next);
    },
    [commit, mode, openIndices],
  );

  const isOpen = useCallback((index: number) => openIndices.has(index), [openIndices]);

  const getTriggerProps = useCallback(
    (index: number) => ({
      'aria-expanded': openIndices.has(index),
      'data-state': (openIndices.has(index) ? 'open' : 'closed') as 'open' | 'closed',
      onClick: () => toggle(index),
    }),
    [openIndices, toggle],
  );

  const getContentProps = useCallback(
    (index: number) => ({
      hidden: !openIndices.has(index),
      'data-state': (openIndices.has(index) ? 'open' : 'closed') as 'open' | 'closed',
    }),
    [openIndices],
  );

  return useMemo(
    () => ({ openIndices, isOpen, toggle, getTriggerProps, getContentProps }),
    [openIndices, isOpen, toggle, getTriggerProps, getContentProps],
  );
}
