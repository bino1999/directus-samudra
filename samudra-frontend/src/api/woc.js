import axiosInstance from './axios'

export const uploadWOC = async (file) => {
  if (!file.name.endsWith('.xlsx')) {
    throw new Error('Please upload a valid .xlsx file only')
  }

  const formData = new FormData()
  formData.append('file', file)

  const fileResponse = await axiosInstance.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const fileId = fileResponse.data.data.id

  const wocResponse = await axiosInstance.post('/items/woc', {
    woc_file: fileId  // ✅ correct field name
  })

  return wocResponse.data
}

export const getWOCRecords = async ({ 
  page = 1, 
  pageSize = 20, 
  sort = '-date_created' 
} = {}) => {
  const response = await axiosInstance.get('/items/woc', {
    params: {
      page,
      limit: pageSize,
      sort,
      fields: 'id,date_created,woc_file.id,woc_file.filename_download,woc_file.filesize,woc_file.uploaded_on,woc_file.type'
      
    }
  })
  return response.data
}

export const createWOCRecord = async (payload) => {
  const response = await axiosInstance.post('/items/woc', payload)
  return response.data
}

export const updateWOCRecord = async (id, payload) => {
  const response = await axiosInstance.patch(`/items/woc/${id}`, payload)
  return response.data
}

export const deleteWOCRecord = async (id) => {
  const response = await axiosInstance.delete(`/items/woc/${id}`)
  return response.data
}

export const getWOCFiles = getWOCRecords

export const downloadWOCFile = async (fileId, filename) => {
  const token = localStorage.getItem('samudra_token')
  const baseUrl = import.meta.env.VITE_DIRECTUS_BASE_URL || 'http://localhost:8055'
  const url = `${baseUrl}/assets/${fileId}?download${token ? `&access_token=${token}` : ''}`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Download failed')

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename || 'woc-file.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}