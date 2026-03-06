import axiosInstance from './axios'

export const getActivity = async ({ page = 1, pageSize = 20, sort = '-date_created' }) => {
  const offset = (page - 1) * pageSize
  const response = await axiosInstance.get('/items/ActivityList', {
    params: { limit: pageSize, offset, sort, meta: 'total_count' },
  })
  return response.data
}

export const createActivity = async (payload) => {
  const response = await axiosInstance.post('/items/ActivityList', payload)
  return response.data
}

export const updateActivity = async (id, payload) => {
  const response = await axiosInstance.patch(`/items/ActivityList/${id}`, payload)
  return response.data
}

export const deleteActivity = async (id) => {
  const response = await axiosInstance.delete(`/items/ActivityList/${id}`)
  return response.data
}