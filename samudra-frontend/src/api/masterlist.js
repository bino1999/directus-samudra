import axiosInstance from './axios'

export const getMasterlist = async ({ page = 1, pageSize = 20, sort = '-date_created' } = {}) => {
  const offset = (page - 1) * pageSize
  const response = await axiosInstance.get('/items/MASTERLIST', {
    params: { limit: pageSize, offset, sort, meta: 'total_count' },
  })
  return response.data
}

export const createMasterlist = async (payload) => {
  const response = await axiosInstance.post('/items/MASTERLIST', payload)
  return response.data
}

export const updateMasterlist = async (id, payload) => {
  const response = await axiosInstance.patch(`/items/MASTERLIST/${id}`, payload)
  return response.data
}

export const deleteMasterlist = async (id) => {
  const response = await axiosInstance.delete(`/items/MASTERLIST/${id}`)
  return response.data
}