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


// MOCK DATA - replace with real API calls when Directus is ready

// const mockActivity = [
//   { id: 1, item_sql: 'RP COMBO NEW INSTALLATION', description_cips: 'RP DEL NEW INSTALLATION', group: 'TM - CBC ( UNIFI)', tm_price: 94, installer_price_80: 75.2, installer_price_77: 72.38, installer_price_40: 37.6 },
//   { id: 2, item_sql: 'UI_OVER THE CEILING', description_cips: 'UI_OVER THE CEILING', group: 'TM - CBC ( UNIFI)', tm_price: 66, installer_price_80: 52.8, installer_price_77: 50.82, installer_price_40: 26.4 },
//   { id: 3, item_sql: 'FTTH-BTU', description_cips: 'UI_SEM:INS FTTH(OH) HR UG(SHARED BTU ODR', group: 'TM - CBC ( UNIFI)', tm_price: 65, installer_price_80: 52, installer_price_77: 50.05, installer_price_40: 26 },
//   { id: 4, item_sql: 'FTTH-BTU', description_cips: 'RP SEM:INS FTTH(OH) HR UG(SHARED BTU ODR', group: 'TM - CBC ( UNIFI)', tm_price: 65, installer_price_80: 52, installer_price_77: 50.05, installer_price_40: 26 },
//   { id: 5, item_sql: 'FTTH-BTU+ EXTRAPORT', description_cips: 'RP SEM:INS FTTH(OH) HR UG(SHARED BTU ODR)', group: 'TM - CBC ( PILOT)', tm_price: 88.5, installer_price_80: 70, installer_price_77: 68.05, installer_price_40: 35.4 },
//   { id: 6, item_sql: 'FTTH-BTU+ MESH WIFI', description_cips: 'RP SEM:INS FTTH(OH) HR UG(SHARED BTU ODR', group: 'TM - CBC ( UNIFI)', tm_price: 78.3, installer_price_80: 62.64, installer_price_77: 60.29, installer_price_40: 31.32 },
// ]

// export const getActivity = async ({ page = 1, pageSize = 20 }) => {
//   await new Promise(r => setTimeout(r, 500))
//   return { data: mockActivity, meta: { total_count: mockActivity.length } }
// }

// export const createActivity = async (payload) => {
//   await new Promise(r => setTimeout(r, 400))
//   return { data: { id: Date.now(), ...payload } }
// }

// export const updateActivity = async (id, payload) => {
//   await new Promise(r => setTimeout(r, 400))
//   return { data: { id, ...payload } }
// }

// export const deleteActivity = async (id) => {
//   await new Promise(r => setTimeout(r, 400))
//   return {}
// }