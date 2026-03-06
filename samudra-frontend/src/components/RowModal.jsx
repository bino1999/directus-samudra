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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required` : false,
                    ...(field.type === 'number' && { valueAsNumber: true }),
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name].message}</p>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RowModal
