import axiosInstance from './axios'

export const uploadWOC = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const fileResponse = await axiosInstance.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const fileId = fileResponse.data.data.id

  const wocResponse = await axiosInstance.post('/items/woc', { file: fileId })
  return wocResponse.data
}

export const getWOCFiles = async () => {
  const response = await axiosInstance.get('/items/woc', {
    params: { fields: '*,file.*' },
  })
  return response.data
}


// MOCK DATA - remove this and uncomment real API calls when Directus is ready

// const mockWOCFiles = [
//   { id: 1, file: { filename_download: 'WOC_Jan2026.xlsx', uploaded_on: '2026-01-15T09:30:00Z' } },
//   { id: 2, file: { filename_download: 'WOC_Feb2026.xlsx', uploaded_on: '2026-02-10T14:20:00Z' } },
// ]

// export const uploadWOC = async (file) => {
//   await new Promise(r => setTimeout(r, 800))
//   return { data: { id: Date.now(), file: { filename_download: file.name, uploaded_on: new Date().toISOString() } } }
// }

// export const getWOCFiles = async () => {
//   await new Promise(r => setTimeout(r, 500))
//   return { data: mockWOCFiles }
// }