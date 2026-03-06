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
    params: {
      fields: 'id,date_created,file.id,file.filename_download,file.filesize,file.uploaded_on,file.type',
      sort: '-date_created',
    },
  })
  return response.data
}