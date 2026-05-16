import { useCallback, useMemo, useState } from 'react';

export interface UseDisclosureOptions {
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  /** Called whenever open state changes (in both controlled and uncontrolled modes). */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;
}

/**
 * Headless disclosure (open/close) state machine.
 *
 * - Hook-only. Render whatever markup you want and spread `triggerProps` / `contentProps`.
 * - Supports both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) modes.
 * - Returns stable callbacks and memoized prop bundles.
 */
export function useDisclosure({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: UseDisclosureOptions = {}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  const triggerProps = useMemo(
    () => ({ 'aria-expanded': isOpen, onClick: toggle }),
    [isOpen, toggle],
  );

  const contentProps = useMemo(() => ({ hidden: !isOpen }), [isOpen]);

  return { isOpen, open, close, toggle, triggerProps, contentProps };
}
