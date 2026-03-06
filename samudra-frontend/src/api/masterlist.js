import axiosInstance from './axios'

// const mockMasterlist = [
//   { id: 1, installer_id: 'Q001191', name: 'FAIZAL BIN SHAFIEI', team_leader: 'TEAM LEADER', company_name: 'FAIZAL BIN SHAFIEI', company_supplier_code: '400-F0022', company_customer_code: 'CUST-001', company_name_sql: 'FAIZAL BIN SHAFIEI (Q001191)', percentage: 0.77, email: 'lantimur@gmail.com', reference_2: 'REF-1', project: 'TM-CF-FF (BGI)' },
//   { id: 2, installer_id: 'NX2505368', name: 'MARIA LOPEZ', team_leader: 'TEAM LEADER', company_name: 'SUNSET SERVICES', company_supplier_code: '400-S0045', company_customer_code: 'CUST-002', company_name_sql: 'SUNSET_SERVICES_SQL', percentage: 0.10, email: 'maria@example.com', reference_2: 'REF-2', project: 'Project Horizon' },
// ]

const USE_DIRECTUS = Boolean(import.meta.env.VITE_DIRECTUS_BASE_URL)

export const getMasterlist = async ({ page = 1, pageSize = 20, sort = '-date_created' } = {}) => {
  // if (!USE_DIRECTUS) {
  //   await new Promise(r => setTimeout(r, 300))
  //   return { data: mockMasterlist, meta: { total_count: mockMasterlist.length } }
  // }

  const offset = (page - 1) * pageSize
  const response = await axiosInstance.get('/items/MASTERLIST', {
    params: { limit: pageSize, offset, sort, meta: 'total_count' },
  })
  return response.data
}

export const createMasterlist = async (payload) => {
  if (!USE_DIRECTUS) {
    await new Promise(r => setTimeout(r, 300))
    return { data: { id: Date.now(), ...payload } }
  }
  const response = await axiosInstance.post('/items/MASTERLIST', payload)
  return response.data
}

export const updateMasterlist = async (id, payload) => {
  if (!USE_DIRECTUS) {
    await new Promise(r => setTimeout(r, 300))
    return { data: { id, ...payload } }
  }
  const response = await axiosInstance.patch(`/items/MASTERLIST/${id}`, payload)
  return response.data
}

export const deleteMasterlist = async (id) => {
  if (!USE_DIRECTUS) {
    await new Promise(r => setTimeout(r, 300))
    return {}
  }
  const response = await axiosInstance.delete(`/items/MASTERLIST/${id}`)
  return response.data
}