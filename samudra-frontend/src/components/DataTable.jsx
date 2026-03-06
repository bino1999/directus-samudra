import { useState } from 'react'

const SkeletonRow = ({ colCount }) => (
  <tr>
    {Array.from({ length: colCount + 1 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 bg-slate-600 rounded animate-pulse" />
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
  footerText = null,
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
    <div className="space-y-4">
      <div className="bg-teal-500 rounded-xl p-1 shadow-lg">
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
          {/* Fetching indicator */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 px-5 py-3 bg-teal-500/10 border-b border-teal-500/20">
              <div className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-teal-300 font-medium">Refreshing data...</span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 border-b border-slate-600">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-5 py-4 text-left font-semibold text-slate-100 whitespace-nowrap ${
                        col.sortable ? 'cursor-pointer hover:text-white select-none' : ''
                      }`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {col.sortable && (
                          <span className="text-slate-400 text-xs opacity-60">
                            {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-4 text-left font-semibold text-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} colCount={columns.length} />
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-slate-400">
                    <p className="text-sm">No records found</p>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row.id ?? rowIndex}
                    className={`${rowIndex % 2 === 0 ? 'bg-slate-750' : 'bg-slate-700'} hover:bg-slate-600 transition-colors`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4 text-slate-100 whitespace-nowrap text-sm">
                        {row[col.key] ?? '—'}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-md transition-all shadow-sm hover:shadow-md"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-md transition-all shadow-sm hover:shadow-md"
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
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700 bg-slate-800 rounded-b-lg">
            <p className="text-xs text-slate-400">
              {totalCount === 0
                ? 'No records'
                : `Showing ${startRecord} to ${endRecord} of ${totalCount} records`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || isLoading}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {footerText && (
            <div className="text-center text-sm font-medium text-slate-700 bg-teal-500 px-5 py-3 rounded-b-lg">{footerText}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataTable
