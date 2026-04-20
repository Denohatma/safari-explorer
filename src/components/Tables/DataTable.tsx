import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Column,
} from '@tanstack/react-table'

interface Props<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  onRowClick?: (row: T) => void
  searchPlaceholder?: string
  footerRow?: Record<string, string | number>
  compact?: boolean
  showColumnFilters?: boolean
  dropdownFilterColumns?: string[]
}

function TextFilter<T>({ column }: { column: Column<T, unknown> }) {
  const val = column.getFilterValue()
  return (
    <input
      type="text"
      value={(val ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder="Filter..."
      className="w-full text-[10px] border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-safari-green/30 bg-white"
      onClick={e => e.stopPropagation()}
    />
  )
}

function DropdownFilter<T>({ column, data }: { column: Column<T, unknown>; data: T[] }) {
  const options = useMemo(() => {
    const vals = new Set<string>()
    for (const row of data) {
      const v = (row as Record<string, unknown>)[column.id]
      if (v != null) vals.add(String(v))
    }
    return Array.from(vals).sort()
  }, [data, column.id])

  const val = column.getFilterValue()
  return (
    <select
      value={(val ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value || undefined)}
      className="w-full text-[10px] border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-safari-green/30 bg-white"
      onClick={e => e.stopPropagation()}
    >
      <option value="">All</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function DataTable<T>({ data, columns, onRowClick, searchPlaceholder = 'Search...', footerRow, compact = false, showColumnFilters = false, dropdownFilterColumns = [] }: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: unknown }[]>([])

  const dropdownSet = useMemo(() => new Set(dropdownFilterColumns), [dropdownFilterColumns])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const textSize = compact ? 'text-[11px]' : 'text-sm'
  const cellPad = compact ? 'px-2 py-1' : 'px-3 py-2'
  const headerPad = compact ? 'px-2 py-1.5' : 'px-3 py-2'

  return (
    <div className="flex flex-col h-full">
      <div className={`${compact ? 'p-2' : 'p-3'} border-b border-gray-100`}>
        <input
          type="text"
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full ${textSize} border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-safari-green/30`}
        />
      </div>
      <div className="overflow-auto flex-1">
        <table className={`w-full ${textSize}`}>
          <thead className="bg-safari-dark/[0.03] sticky top-0 z-10">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className={`${headerPad} text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}
                  >
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer hover:text-gray-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                    </div>
                    {showColumnFilters && header.column.getCanFilter() && (
                      <div className="mt-1">
                        {dropdownSet.has(header.column.id)
                          ? <DropdownFilter column={header.column} data={data} />
                          : <TextFilter column={header.column} />
                        }
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={`hover:bg-safari-green/5 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={`${cellPad} whitespace-nowrap`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {footerRow && (
            <tfoot className="bg-gray-50 font-semibold border-t-2 border-gray-300">
              <tr>
                {table.getAllColumns().map(col => (
                  <td key={col.id} className={`${cellPad} whitespace-nowrap ${textSize}`}>
                    {footerRow[col.id] ?? ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No results match your search.
          </div>
        )}
      </div>
    </div>
  )
}
