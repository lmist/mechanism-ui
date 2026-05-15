import { useState, useCallback } from 'react';

interface DisclosureOptions {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useDisclosure({ open: controlledOpen, onOpenChange }: DisclosureOptions = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle,
    triggerProps: {
      'aria-expanded': isOpen,
      onClick: toggle,
    },
    contentProps: {
      hidden: !isOpen,
    },
  };
}
