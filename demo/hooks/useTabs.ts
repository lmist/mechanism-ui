import { useCallback, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface UseTabsOptions {
  /** Controlled active index. Omit for uncontrolled. */
  activeIndex?: number;
  /** Called whenever the active index changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Initial active index when uncontrolled. Defaults to 0. */
  defaultIndex?: number;
  /** Total number of tabs — required for keyboard nav (Arrow/Home/End). */
  count: number;
  /** Horizontal binds Left/Right arrows; vertical binds Up/Down. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Headless tabs. Returns prop factories for the tablist, each tab, and each panel.
 * Supports controlled + uncontrolled active index and keyboard navigation
 * (ArrowLeft/Right wraps; Home/End jump to first/last).
 */
export function useTabs({
  activeIndex: controlledIndex,
  onActiveIndexChange,
  defaultIndex = 0,
  count,
  orientation = 'horizontal',
}: UseTabsOptions) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const setActiveIndex = useCallback(
    (next: number) => {
      const clamped = ((next % count) + count) % count;
      if (!isControlled) setInternalIndex(clamped);
      onActiveIndexChange?.(clamped);
    },
    [count, isControlled, onActiveIndexChange],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const isHorizontal = orientation === 'horizontal';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      switch (e.key) {
        case nextKey:
          e.preventDefault();
          setActiveIndex(activeIndex + 1);
          break;
        case prevKey:
          e.preventDefault();
          setActiveIndex(activeIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(count - 1);
          break;
      }
    },
    [activeIndex, count, orientation, setActiveIndex],
  );

  const tabListProps = useMemo(
    () => ({
      role: 'tablist' as const,
      'aria-orientation': orientation,
      onKeyDown,
    }),
    [onKeyDown, orientation],
  );

  const getTabProps = useCallback(
    (index: number) => ({
      role: 'tab' as const,
      'aria-selected': activeIndex === index,
      'data-state': (activeIndex === index ? 'active' : 'inactive') as 'active' | 'inactive',
      tabIndex: activeIndex === index ? 0 : -1,
      onClick: () => setActiveIndex(index),
    }),
    [activeIndex, setActiveIndex],
  );

  const getPanelProps = useCallback(
    (index: number) => ({
      role: 'tabpanel' as const,
      hidden: activeIndex !== index,
    }),
    [activeIndex],
  );

  return { activeIndex, tabListProps, getTabProps, getPanelProps };
}
