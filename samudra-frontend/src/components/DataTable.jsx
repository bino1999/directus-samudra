import { useState } from 'react'

const SkeletonRow = ({ colCount }) => (
  <tr>
    {Array.from({ length: colCount + 1 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse" />
      </td>
    ))}
  </tr>
)

const DataTable = ({
  data = [],
  columns = [],
  totalCount = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
  isLoading = false,
  isFetching = false,
}) => {
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  const totalPages = Math.ceil(totalCount / pageSize)
  const startRecord = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, totalCount)

  const handleSort = (key) => {
    let newDir = 'asc'
    if (sortKey === key && sortDir === 'asc') newDir = 'desc'
    setSortKey(key)
    setSortDir(newDir)
    onSortChange(newDir === 'desc' ? `-${key}` : key)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-blue-600">Refreshing...</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:text-slate-800 select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} colCount={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-400">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {row[col.key] ?? '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500">
          {totalCount === 0
            ? 'No records'
            : `Showing ${startRecord} to ${endRecord} of ${totalCount} records`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
