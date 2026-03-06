import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const RowModal = ({ isOpen, onClose, onSubmit, title, fields = [], defaultValues = null, isLoading = false }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    } else {
      reset({})
    }
  }, [defaultValues, reset])

  if (!isOpen) return null

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-teal-600/10 to-teal-500/10">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-slate-100 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {errors[field.name] && (
                <p className="mt-2 text-sm text-red-400">{errors[field.name].message}</p>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RowModal
