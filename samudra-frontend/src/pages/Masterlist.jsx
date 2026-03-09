import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getMasterlist, createMasterlist, updateMasterlist, deleteMasterlist } from '../api/masterlist'
import DataTable from '../components/DataTable'
import RowModal from '../components/RowModal'
import DeleteConfirm from '../components/DeleteConfirm'


const columns = [
  { key: 'installer_id', label: 'Installer ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'team_leader', label: 'Team Leader', sortable: true },
  { key: 'company_name', label: 'Company Name', sortable: true },
  { key: 'company_supplier_code', label: 'Company Supplier Code', sortable: true },
  { key: 'company_customer_code', label: 'Company Customer Code', sortable: true },
  { key: 'company_name_sql', label: 'Company Name SQL', sortable: true },
  { key: 'percentage', label: 'Percentage', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'reference_2', label: 'Reference 2', sortable: false },
  { key: 'project', label: 'Project', sortable: true },
]

const fields = [
  { name: 'installer_id', label: 'Installer ID', type: 'text', required: true },
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'team_leader', label: 'Team Leader', type: 'text', required: false },
  { name: 'company_name', label: 'Company Name', type: 'text', required: false },
  { name: 'company_supplier_code', label: 'Company Supplier Code', type: 'text', required: false },
  { name: 'company_customer_code', label: 'Company Customer Code', type: 'text', required: false },
  { name: 'company_name_sql', label: 'Company Name SQL', type: 'text', required: false },
  { name: 'percentage', label: 'Percentage', type: 'number', required: false },
  { name: 'email', label: 'Email', type: 'text', required: false },
  { name: 'reference_2', label: 'Reference 2', type: 'text', required: false },
  { name: 'project', label: 'Project', type: 'text', required: false },
]

const Masterlist = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [sort, setSort] = useState('-date_created')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['masterlist', page, pageSize, sort],
    queryFn: () => getMasterlist({ page, pageSize, sort }),
  })

  const createMutation = useMutation({
    mutationFn: createMasterlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterlist'] })
      setIsAddOpen(false)
      toast.success('Record added successfully.')
    },
    onError: () => toast.error('Failed to add record. Please try again.'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateMasterlist(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterlist'] })
      setIsEditOpen(false)
      toast.success('Record updated successfully.')
    },
    onError: () => toast.error('Failed to update record. Please try again.'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMasterlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterlist'] })
      setIsDeleteOpen(false)
      toast.success('Record deleted.')
    },
    onError: () => toast.error('Failed to delete record. Please try again.'),
  })

  const handleEdit = (row) => { setSelectedRow(row); setIsEditOpen(true) }
  const handleDelete = (row) => { setSelectedRow(row); setIsDeleteOpen(true) }
  const handleSortChange = (newSort) => { setSort(newSort); setPage(1) }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Masterlist</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and organize all installer and company information</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <span>➕</span>
          Add Record
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={
          data?.data ?? [
            {
              installer_id: 'INST-001',
              name: 'John Doe',
              team_leader: 'Alice Smith',
              company_name: "Acme Installers",
              company_supplier_code: 'SUP-123',
              company_customer_code: 'CUST-987',
              company_name_sql: 'ACME_SQL',
              percentage: 12.5,
              email: 'john.doe@example.com',
              reference_2: 'REF-2026-01',
              project: 'Project Sunrise',
            },
            {
              installer_id: 'INST-002',
              name: 'Maria Lopez',
              team_leader: 'Bob Tan',
              company_name: "Sunset Services",
              company_supplier_code: 'SUP-456',
              company_customer_code: 'CUST-654',
              company_name_sql: 'SUNSET_SQL',
              percentage: 10,
              email: 'maria.lopez@example.com',
              reference_2: 'REF-2026-02',
              project: 'Project Horizon',
            },
          ]
        }
        columns={columns}
        totalCount={data?.meta?.total_count ?? 2}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* Add Modal */}
      <RowModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        title="Add Masterlist Item"
        fields={fields}
        defaultValues={null}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <RowModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedRow(null) }}
        onSubmit={(formData) => {
          const changed = Object.keys(formData).reduce((acc, key) => {
            if (String(formData[key] ?? '') !== String(selectedRow?.[key] ?? '')) {
              acc[key] = formData[key]
            }
            return acc
          }, {})
          if (Object.keys(changed).length === 0) {
            toast.info('No changes detected.')
            return
          }
          updateMutation.mutate({ id: selectedRow.id, payload: changed })
        }}
        title="Edit Masterlist Item"
        fields={fields}
        defaultValues={selectedRow}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirm */}
      <DeleteConfirm
        isOpen={isDeleteOpen}
        onConfirm={() => deleteMutation.mutate(selectedRow.id)}
        onCancel={() => { setIsDeleteOpen(false); setSelectedRow(null) }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default Masterlist
