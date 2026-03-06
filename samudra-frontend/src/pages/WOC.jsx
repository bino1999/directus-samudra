import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadWOC, getWOCFiles } from '../api/woc'

const WOC = () => {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['woc'],
    queryFn: getWOCFiles,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadWOC,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['woc'] })
      setSelectedFile(null)
      toast.success('WOC file uploaded successfully. Admin has been notified.')
    },
    onError: () => toast.error('Upload failed. Please try again.'),
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx')) {
      setFileError('Invalid file format. Please upload a valid .xlsx file.')
      setSelectedFile(null)
      e.target.value = ''
      return
    }

    setFileError('')
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) uploadMutation.mutate(selectedFile)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const getFileName = (record) => {
  if (!record.woc_file) return '—'
  if (typeof record.woc_file === 'object') return record.woc_file.filename_download ?? '—'
  return '—'
}

const getUploadDate = (record) => {
  if (record.woc_file && typeof record.woc_file === 'object') {
    return formatDate(record.woc_file.uploaded_on ?? record.woc_file.date_created)
  }
  return formatDate(record.date_created)
}

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">WOC File Upload</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload a WOC Excel file. The admin will be notified automatically.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8 max-w-lg">
        <h2 className="text-sm font-semibold text-slate-100 mb-4">Upload New File</h2>

        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center mb-4 hover:border-teal-400 transition-colors">
          <p className="text-2xl mb-2">📂</p>
          <p className="text-sm text-slate-400 mb-3">Select a .xlsx file to upload</p>
          <label htmlFor="woc-file" className="cursor-pointer inline-block px-4 py-2 text-sm font-medium text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 rounded-lg transition-colors">
            Browse File
            <input
              id="woc-file"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-700 rounded-lg mb-4">
            <span className="text-lg">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-slate-400 hover:text-slate-200 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {fileError && (
          <p className="text-xs text-red-400 mb-4">{fileError}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
        >
          {uploadMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {/* Upload History */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Previously Uploaded Files</h2>
        <div className="p-1 border border-teal-600 rounded-xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-850">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">Loading...</div>
            ) : !data?.data?.length ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">No files uploaded yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-750">
                    <th className="px-5 py-4 text-left font-semibold text-slate-200">File Name</th>
                    <th className="px-5 py-4 text-left font-semibold text-slate-200">Size</th>
                    <th className="px-5 py-4 text-left font-semibold text-slate-200">Uploaded On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data.data.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-5 py-4 text-slate-200 flex items-center gap-2">
                        <span>📄</span>
                        <span>{getFileName(record)}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                       {record.woc_file?.filesize ? formatFileSize(record.woc_file.filesize) : '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {getUploadDate(record)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WOC
