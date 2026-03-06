const DeleteConfirm = ({ isOpen, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-lg shrink-0">
            🗑️
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Delete Record</h2>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this record?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirm
