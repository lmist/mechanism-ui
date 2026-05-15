import { useState, useCallback } from 'react';

export function useAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getTriggerProps = useCallback((index: number) => ({
    onClick: () => setOpenIndex(openIndex === index ? null : index),
    'aria-expanded': openIndex === index,
  }), [openIndex]);

  const getContentProps = useCallback((index: number) => ({
    hidden: openIndex !== index,
  }), [openIndex]);

  return { getTriggerProps, getContentProps };
}
