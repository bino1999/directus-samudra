import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getActivity, createActivity, updateActivity, deleteActivity } from '../api/activity'
import DataTable from '../components/DataTable'
import RowModal from '../components/RowModal'
import DeleteConfirm from '../components/DeleteConfirm'

const columns = [
  { key: 'item_sql', label: 'Item SQL', sortable: true },
  { key: 'description_cips', label: 'Description CIPS', sortable: true },
  { key: 'group', label: 'Group', sortable: true },
  { key: 'tm_price', label: 'TM Price', sortable: true },
  { key: 'column_e', label: 'Column E', sortable: true },
  { key: 'installer_price_100', label: 'Installer Price 100', sortable: true },
  { key: 'installer_price_95', label: 'Installer Price 95', sortable: true },
  { key: 'installer_price_80', label: 'Installer Price 80', sortable: true },
  { key: 'installer_price_77', label: 'Installer Price 77', sortable: true },
  { key: 'installer_price_40', label: 'Installer Price 40', sortable: true },
  { key: 'installer_price_82', label: 'Installer Price 82', sortable: true },
  { key: 'installer_price_65', label: 'Installer Price 65', sortable: true },
  { key: 'notes', label: 'Notes', sortable: false },
]

const fields = [
  { name: 'item_sql', label: 'Item SQL', type: 'text', required: true },
  { name: 'description_cips', label: 'Description CIPS', type: 'text', required: true },
  { name: 'group', label: 'Group', type: 'text', required: true },
  { name: 'tm_price', label: 'TM Price', type: 'number', required: true },
  { name: 'column_e', label: 'Column E', type: 'text', required: false },
  { name: 'installer_price_100', label: 'Installer Price 100', type: 'number', required: false },
  { name: 'installer_price_95', label: 'Installer Price 95', type: 'number', required: false },
  { name: 'installer_price_80', label: 'Installer Price 80', type: 'number', required: false },
  { name: 'installer_price_77', label: 'Installer Price 77', type: 'number', required: false },
  { name: 'installer_price_40', label: 'Installer Price 40', type: 'number', required: false },
  { name: 'installer_price_82', label: 'Installer Price 82', type: 'number', required: false },
  { name: 'installer_price_65', label: 'Installer Price 65', type: 'number', required: false },
  { name: 'notes', label: 'Notes', type: 'text', required: false },
]

const Activity = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [sort, setSort] = useState('-date_created')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['activity', page, pageSize, sort],
    queryFn: () => getActivity({ page, pageSize, sort }),
  })

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] })
      setIsAddOpen(false)
      toast.success('Record added successfully.')
    },
    onError: () => toast.error('Failed to add record. Please try again.'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateActivity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] })
      setIsEditOpen(false)
      toast.success('Record updated successfully.')
    },
    onError: () => toast.error('Failed to update record. Please try again.'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] })
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
          <h1 className="text-3xl font-bold text-slate-100">Activity</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor all activity records in your system</p>
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
              item_sql: 'SQL001',
              description_cips: 'Sample description',
              group: 'A',
              tm_price: 1000,
              column_e: 'E1',
              installer_price_100: 1200,
              installer_price_95: 1150,
              installer_price_80: 1000,
              installer_price_77: 950,
              installer_price_40: 800,
              installer_price_82: 980,
              installer_price_65: 700,
              notes: 'Test note',
            },
          ]
        }
        columns={columns}
        totalCount={data?.meta?.total_count ?? 1}
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
        title="Add Activity"
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
        title="Edit Activity"
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

export default Activity
