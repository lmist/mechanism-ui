import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K;
  direction: SortDirection;
}

export interface UseDataTableOptions<R, K extends Extract<keyof R, string>> {
  data: ReadonlyArray<R>;
  /** Subset of keys that are sortable. Defaults to all string keys of R. */
  sortableKeys?: ReadonlyArray<K>;
  /** Function returning a stable id for a row. Defaults to `row.id`. */
  getRowId?: (row: R) => string | number;
  /** Page size (rows per page). Defaults to 5. Set to 0 to disable pagination. */
  pageSize?: number;
  /** Initial sort. */
  defaultSort?: SortState<K> | null;
}

/**
 * Headless data table.
 *
 * - Sort: click a header to cycle asc → desc → none.
 * - Pagination: configurable `pageSize`. Set to 0 to render all rows.
 * - Selection: click a row to toggle. `getSelectAllProps` selects/clears the
 *   current page. `selectedIds` is a Set the consumer can read.
 *
 * Hook-only. Render any markup and spread the returned prop factories.
 */
export function useDataTable<R, K extends Extract<keyof R, string> = Extract<keyof R, string>>({
  data,
  sortableKeys,
  getRowId = (row: R) => (row as { id: string | number }).id,
  pageSize = 5,
  defaultSort = null,
}: UseDataTableOptions<R, K>) {
  const [sort, setSort] = useState<SortState<K> | null>(defaultSort);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string | number>>(() => new Set());

  const sortable = useMemo(
    () => new Set<string>(sortableKeys ?? []),
    [sortableKeys],
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [data, sort]);

  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  const pagedData = useMemo(() => {
    if (pageSize <= 0) return sortedData;
    const start = safePageIndex * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [pageSize, safePageIndex, sortedData]);

  const toggleSort = useCallback(
    (key: K) => {
      if (sortableKeys && !sortable.has(key)) return;
      setSort((current) => {
        if (!current || current.key !== key) return { key, direction: 'asc' };
        if (current.direction === 'asc') return { key, direction: 'desc' };
        return null;
      });
    },
    [sortable, sortableKeys],
  );

  const toggleRow = useCallback((id: string | number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pageIds = useMemo(() => pagedData.map(getRowId), [pagedData, getRowId]);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const toggleSelectAllOnPage = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  }, [allPageSelected, pageIds]);

  const getHeaderProps = useCallback(
    (key: K) => {
      const isSortable = !sortableKeys || sortable.has(key);
      const isSorted = sort?.key === key;
      return {
        onClick: isSortable ? () => toggleSort(key) : undefined,
        'aria-sort': (isSorted
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none') as 'ascending' | 'descending' | 'none',
        'data-sortable': isSortable,
      };
    },
    [sort, sortable, sortableKeys, toggleSort],
  );

  const getRowProps = useCallback(
    (row: R) => {
      const id = getRowId(row);
      const selected = selectedIds.has(id);
      return {
        'aria-selected': selected,
        'data-state': (selected ? 'selected' : 'unselected') as 'selected' | 'unselected',
        onClick: () => toggleRow(id),
      };
    },
    [getRowId, selectedIds, toggleRow],
  );

  const getSelectAllProps = useCallback(
    () => ({
      checked: allPageSelected,
      'aria-checked': (allPageSelected
        ? 'true'
        : somePageSelected
          ? 'mixed'
          : 'false') as 'true' | 'false' | 'mixed',
      onChange: toggleSelectAllOnPage,
    }),
    [allPageSelected, somePageSelected, toggleSelectAllOnPage],
  );

  const goToPage = useCallback(
    (index: number) => setPageIndex(Math.max(0, Math.min(index, pageCount - 1))),
    [pageCount],
  );
  const nextPage = useCallback(() => goToPage(safePageIndex + 1), [goToPage, safePageIndex]);
  const prevPage = useCallback(() => goToPage(safePageIndex - 1), [goToPage, safePageIndex]);

  const canPrev = safePageIndex > 0;
  const canNext = safePageIndex < pageCount - 1;

  const prevPageProps = useMemo(
    () => ({ type: 'button' as const, onClick: prevPage, disabled: !canPrev }),
    [canPrev, prevPage],
  );
  const nextPageProps = useMemo(
    () => ({ type: 'button' as const, onClick: nextPage, disabled: !canNext }),
    [canNext, nextPage],
  );

  return {
    sortedData,
    pagedData,
    selectedIds,
    sort,
    pageIndex: safePageIndex,
    pageCount,
    pageSize,
    canPrev,
    canNext,
    getHeaderProps,
    getRowProps,
    getSelectAllProps,
    prevPageProps,
    nextPageProps,
    toggleRow,
    toggleSort,
    goToPage,
    nextPage,
    prevPage,
  };
}
