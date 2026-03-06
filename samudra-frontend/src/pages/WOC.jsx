import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { uploadWOC, getWOCFiles, downloadWOCFile } from '../api/woc'

const WOC = () => {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [preview, setPreview] = useState(null)   // { name, sheets: [{ name, headers, rows }] }
  const [previewSheet, setPreviewSheet] = useState(0)
  const [previewLoading, setPreviewLoading] = useState(false)

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

  const getFileId = (record) => {
    if (!record.woc_file) return null
    if (typeof record.woc_file === 'object') return record.woc_file.id ?? null
    return record.woc_file
  }

  const handleDownload = async (record) => {
    const fileId = getFileId(record)
    if (!fileId) return toast.error('File not available for download.')
    try {
      await downloadWOCFile(fileId, getFileName(record))
      toast.success('File downloaded successfully.')
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const handlePreview = async (record) => {
    const fileId = getFileId(record)
    const filename = getFileName(record)
    if (!fileId) return toast.error('File not available for preview.')

    setPreviewLoading(true)
    try {
      const token = localStorage.getItem('samudra_token')
      const baseUrl = import.meta.env.VITE_DIRECTUS_BASE_URL || 'http://localhost:8055'
      const url = `${baseUrl}/assets/${fileId}${token ? `?access_token=${token}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch file')

      const arrayBuffer = await res.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      const sheets = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
        const headers = json[0] ?? []
        const rows = json.slice(1)
        return { name: sheetName, headers, rows }
      })

      setPreview({ name: filename, sheets })
      setPreviewSheet(0)
    } catch {
      toast.error('Failed to preview file. Please try downloading instead.')
    } finally {
      setPreviewLoading(false)
    }
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
                    <th className="px-5 py-4 text-right font-semibold text-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data.data.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handlePreview(record)}
                          disabled={!getFileId(record) || previewLoading}
                          className="flex items-center gap-2 text-teal-300 hover:text-teal-100 hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                        >
                          <span>📄</span>
                          <span className="text-sm">{getFileName(record)}</span>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                       {record.woc_file?.filesize ? formatFileSize(record.woc_file.filesize) : '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {getUploadDate(record)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePreview(record)}
                            disabled={!getFileId(record) || previewLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all shadow-sm hover:shadow-md"
                          >
                            {previewLoading ? '⏳' : '👁'} Preview
                          </button>
                          <button
                            onClick={() => handleDownload(record)}
                            disabled={!getFileId(record)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all shadow-sm hover:shadow-md"
                          >
                            ⬇ Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Excel Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setPreview(null) }}
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl border border-slate-700 overflow-hidden mb-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-teal-600/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-base font-semibold text-slate-100 truncate max-w-lg">{preview.name}</h2>
                  <p className="text-xs text-slate-400">{preview.sheets.length} sheet{preview.sheets.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Sheet Tabs */}
            {preview.sheets.length > 1 && (
              <div className="flex gap-1 px-6 pt-4 border-b border-slate-700 bg-slate-800">
                {preview.sheets.map((sheet, i) => (
                  <button
                    key={sheet.name}
                    onClick={() => setPreviewSheet(i)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      previewSheet === i
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {sheet.name}
                  </button>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="overflow-auto max-h-[60vh]">
              {preview.sheets[previewSheet]?.rows?.length === 0 ? (
                <p className="px-6 py-8 text-center text-slate-400 text-sm">No data in this sheet.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-700 border-b border-slate-600">
                      <th className="px-4 py-3 text-left font-semibold text-slate-400 whitespace-nowrap">#</th>
                      {preview.sheets[previewSheet].headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left font-semibold text-slate-200 whitespace-nowrap">
                          {h !== '' ? String(h) : `Col ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {preview.sheets[previewSheet].rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'}>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{ri + 1}</td>
                        {preview.sheets[previewSheet].headers.map((_, ci) => (
                          <td key={ci} className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                            {row[ci] !== undefined && row[ci] !== '' ? String(row[ci]) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-700 bg-slate-800/50">
              <p className="text-xs text-slate-400">
                {preview.sheets[previewSheet]?.rows?.length ?? 0} rows × {preview.sheets[previewSheet]?.headers?.length ?? 0} columns
              </p>
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WOC
