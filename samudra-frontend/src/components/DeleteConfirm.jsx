const DeleteConfirm = ({ isOpen, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-2xl shrink-0 border border-red-500/20">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Delete Record</h2>
              <p className="text-sm text-slate-400">This cannot be undone</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Are you sure you want to delete this record? This action is permanent and cannot be reversed.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              Keep It
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirm
