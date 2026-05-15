import { useState, useCallback } from 'react';

export function useCombobox(options: string[]) {
  const [query, setQuery] = useState('');
  
  const filtered = options.filter(o => 
    o.toLowerCase().includes(query.toLowerCase())
  );

  const inputProps = {
    value: query,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    placeholder: 'Type to filter...',
  };

  const getOptionProps = useCallback((option: string) => ({
    onClick: () => setQuery(option),
  }), []);

  return {
    inputProps,
    listProps: { role: 'listbox' as const },
    getOptionProps,
    isOpen: query.length > 0,
    filtered,
  };
}
