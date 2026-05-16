import { useCallback, useId, useMemo, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

export interface UseComboboxOptions<T> {
  /** Source of options to filter. */
  options: T[];
  /** Return a string label for filtering / displaying an option. */
  getLabel?: (option: T) => string;
  /** Controlled input value. Omit for uncontrolled. */
  value?: string;
  /** Called whenever the input value changes. */
  onValueChange?: (value: string) => void;
  /** Called whenever an option is selected via click or Enter. */
  onSelect?: (option: T) => void;
}

/**
 * Headless combobox. Filters `options` by the input value and exposes
 * keyboard navigation (Arrow/Home/End/Enter/Escape) with `aria-activedescendant`.
 * Hook-only — render whatever markup you want.
 */
export function useCombobox<T>({
  options,
  getLabel = (o) => String(o),
  value: controlledValue,
  onValueChange,
  onSelect,
}: UseComboboxOptions<T>) {
  const listId = useId();
  const [internalValue, setInternalValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const filtered = useMemo(
    () => options.filter((o) => getLabel(o).toLowerCase().includes(value.toLowerCase())),
    [options, value, getLabel],
  );

  const optionId = useCallback((index: number) => `${listId}-option-${index}`, [listId]);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const selectIndex = useCallback(
    (index: number) => {
      const option = filtered[index];
      if (option === undefined) return;
      setValue(getLabel(option));
      onSelect?.(option);
      setIsOpen(false);
    },
    [filtered, getLabel, onSelect, setValue],
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setActiveIndex(0);
      setIsOpen(true);
    },
    [setValue],
  );

  const onFocus = useCallback(() => setIsOpen(true), []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) =>
            filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length,
          );
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(Math.max(0, filtered.length - 1));
          break;
        case 'Enter':
          if (isOpen) {
            e.preventDefault();
            selectIndex(activeIndex);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [activeIndex, filtered.length, isOpen, selectIndex],
  );

  const inputProps = useMemo(
    () => ({
      role: 'combobox' as const,
      value,
      onChange,
      onFocus,
      onKeyDown,
      'aria-expanded': isOpen,
      'aria-controls': listId,
      'aria-activedescendant': isOpen && filtered.length > 0 ? optionId(activeIndex) : undefined,
      'aria-autocomplete': 'list' as const,
      placeholder: 'Type to filter...',
    }),
    [activeIndex, filtered.length, isOpen, listId, onChange, onFocus, onKeyDown, optionId, value],
  );

  const listProps = useMemo(
    () => ({ id: listId, role: 'listbox' as const }),
    [listId],
  );

  const getOptionProps = useCallback(
    (option: T, index: number) => ({
      id: optionId(index),
      role: 'option' as const,
      'aria-selected': index === activeIndex,
      'data-state': (index === activeIndex ? 'active' : 'inactive') as 'active' | 'inactive',
      onMouseEnter: () => setActiveIndex(index),
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
      onClick: () => selectIndex(index),
    }),
    [activeIndex, optionId, selectIndex],
  );

  return { inputProps, listProps, getOptionProps, isOpen, filtered, activeIndex };
}
