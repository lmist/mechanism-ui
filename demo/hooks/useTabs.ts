import { useState, useCallback } from 'react';

export function useTabs(defaultIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const getTabProps = useCallback((index: number) => ({
    role: 'tab' as const,
    'aria-selected': activeIndex === index,
    onClick: () => setActiveIndex(index),
    'data-state': activeIndex === index ? 'active' : 'inactive',
  }), [activeIndex]);

  const getPanelProps = useCallback((index: number) => ({
    role: 'tabpanel' as const,
    hidden: activeIndex !== index,
  }), [activeIndex]);

  return { activeIndex, getTabProps, getPanelProps };
}
