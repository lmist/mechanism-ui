import { useState, useCallback } from 'react';

export type Row = { id: number; name: string; role: string };

export function useDataTable(data: Row[]) {
  const [sortKey, setSortKey] = useState<'name' | 'role' | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    return a[sortKey].localeCompare(b[sortKey]);
  });

  const getHeaderProps = useCallback((key: 'name' | 'role') => ({
    onClick: () => setSortKey(key),
  }), []);

  const getRowProps = useCallback((row: Row) => ({}), []);

  return { getHeaderProps, getRowProps, sortedData };
}
