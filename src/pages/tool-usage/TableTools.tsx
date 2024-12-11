import {
  ActionIcon,
  Box,
  Button,
  Group,
  MantineProvider,
  Modal,
  Progress,
  TextInput,
  useMantineTheme
} from '@mantine/core'
import LoadingScreen from '@renderer/components/LoadingScreen/LoadingScreen'
import { addNotification } from '@renderer/store'
import { EntityToolUsageInterface } from '@renderer/types/toolUsage'
import { IconDownload, IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  useCreateToolUsageMutation,
  useDeleteToolUsageMutation,
  useFetchToolUsageQuery,
  useUpdateToolUsageBatchMutation,
  useUpdateToolUsageMutation
} from './@tool.api'
import { FormTool } from './FormTool'
import { FormToolBatch } from './FormToolBatch'

export interface ToolUsage extends EntityToolUsageInterface {
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

const TableTools = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isBatchModalOpen, setBatchModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<ToolUsage | null>(null)
  const [deletingTool, setDeletingTool] = useState<ToolUsage | null>(null)
  const [mcCd, setMcCd] = useState<string | undefined>(undefined)
  const [mcComId, setMcComId] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const theme = useMantineTheme()

  const {
    data: { data: data = [], meta = {} } = {},
    isError,
    isLoading,
    isFetching,
    refetch
  } = useFetchToolUsageQuery({
    mcCd,
    mcComId,
    page: pagination.pageIndex,
    perPage: pagination.pageSize
  })

  const [postToolUsage, { isLoading: LoadingPost, isError: ErrorPost, isSuccess: SuccessPost }] =
    useCreateToolUsageMutation()

  const [
    updateToolUsage,
    { isLoading: LoadingUpdate, isError: ErrorUpdate, isSuccess: SuccessUpdate }
  ] = useUpdateToolUsageMutation()

  const [
    updateToolUsageBatch,
    { isLoading: LoadingUpdateBatch, isError: ErrorUpdateBatch, isSuccess: SuccessUpdateBatch }
  ] = useUpdateToolUsageBatchMutation()

  const [
    deleteToolUsage,
    { isLoading: LoadingDelete, isError: ErrorDelete, isSuccess: SuccessDelete }
  ] = useDeleteToolUsageMutation()

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true
  })

  const handleExportRows = (rows: MRT_Row<EntityToolUsageInterface>[]) => {
    const rowData = rows.map((row) => {
      const transformedRow: Record<string, string | number | boolean | null> = {}
      Object.keys(row.original).forEach((key) => {
        const value = row.original[key]
        if (value instanceof Date) {
          transformedRow[key] = value.toISOString()
        } else {
          transformedRow[key] = value
        }
      })
      return transformedRow
    })
    const csv = generateCsv(csvConfig)(rowData)
    download(csvConfig)(csv)
  }

  const handleExportData = () => {
    const transformedData = data.map((item) => {
      const transformedItem: Record<string, string | number | boolean | null> = {}
      Object.keys(item).forEach((key) => {
        const value = item[key]
        if (value instanceof Date) {
          transformedItem[key] = value.toISOString()
        } else if (typeof value === 'object') {
          // Skip objects like mstMch and toolQurantine
          return
        } else {
          transformedItem[key] = value
        }
      })
      return transformedItem
    })
    const csv = generateCsv(csvConfig)(transformedData)
    download(csvConfig)(csv)
  }

  useEffect(() => {
    const notifications = [
      {
        success: SuccessPost,
        error: ErrorPost,
        successMessage: 'Tool usage added successfully!',
        errorMessage: 'Failed to add tool usage.'
      },
      {
        success: SuccessUpdate,
        error: ErrorUpdate,
        successMessage: 'Tool usage edited successfully!',
        errorMessage: 'Failed to edit tool usage.'
      },
      {
        success: SuccessUpdateBatch,
        error: ErrorUpdateBatch,
        successMessage: 'Tool usage batch edited successfully!',
        errorMessage: 'Failed to edit tool usage batch.'
      },
      {
        success: SuccessDelete,
        error: ErrorDelete,
        successMessage: 'Tool usage deleted successfully!',
        errorMessage: 'Failed to delete tool usage.'
      }
    ]

    notifications.forEach(({ success, error, successMessage, errorMessage }) => {
      if (success) {
        dispatch(
          addNotification({
            id: Math.random().toString(),
            message: successMessage,
            title: 'Success',
            color: 'green'
          })
        )
        if (success === SuccessPost) setModalOpen(false) // Close modal only on post success
      }

      if (error) {
        dispatch(
          addNotification({
            id: Math.random().toString(),
            message: errorMessage,
            title: 'Error',
            color: 'red'
          })
        )
      }
    })
  }, [
    SuccessPost,
    ErrorPost,
    SuccessUpdate,
    ErrorUpdate,
    SuccessUpdateBatch,
    ErrorUpdateBatch,
    SuccessDelete,
    ErrorDelete,
    dispatch
  ])

  useEffect(() => {
    // Trigger refetch setiap kali mcCd berubah
    if (mcCd !== undefined) {
      refetch()
    }
  }, [mcCd, refetch])

  const openAddModal = () => {
    setEditingTool(null)
    setModalOpen(true)
  }

  const openBatchModal = () => {
    setBatchModalOpen(true)
  }

  const openEditModal = (tool: ToolUsage) => {
    setEditingTool(tool)
    setModalOpen(true)
  }

  const openDeleteModal = (tool: ToolUsage) => {
    setDeletingTool(tool)
    setDeleteModalOpen(true)
  }

  const addToolUsage = (
    tool: Omit<ToolUsage, 'createdBy' | 'updatedBy' | 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    postToolUsage({ ...tool })
  }

  const editToolUsage = (
    tool: Omit<ToolUsage, 'createdBy' | 'updatedBy' | 'id' | 'createdAt' | 'updatedAt'>,
    id: number
  ) => {
    updateToolUsage({ data: tool, id })
  }

  const editToolUsageBatch = (
    mcCd: string | undefined,
    mcComId: string | undefined,
    usage: number
  ) => {
    if (mcCd !== undefined && mcComId !== undefined) {
      updateToolUsageBatch({ mcCd, mcComId, usage })
    } else {
      // Handle the case where mcCd is undefined
      console.error('mcCd is undefined')
    }
  }

  const removeToolUsage = (id: number) => {
    deleteToolUsage({ id })
  }

  const columns = useMemo<MRT_ColumnDef<ToolUsage>[]>(
    () => [
      { accessorKey: 'toolName', header: 'Tool Name' },
      { accessorKey: 'usageCount', header: 'Usage Count' },
      { accessorKey: 'usageLimit', header: 'Limit' },
      {
        accessorKey: 'progress',
        header: 'Remaining Life',
        Cell: ({ row }) => {
          const usageCount = row.original.usageCount
          const usageLimit = row.original.usageLimit
          const remainingProgress = Math.max(((usageLimit - usageCount) / usageLimit) * 100, 0) // Cap at 0%

          return (
            <Progress
              value={remainingProgress}
              size="lg"
              color={remainingProgress < 20 ? 'red' : remainingProgress < 50 ? 'yellow' : 'green'}
            />
          )
        },
        sortingFn: (a, b) => {
          const aRemainingProgress = Math.max(
            ((a.original.usageLimit - a.original.usageCount) / a.original.usageLimit) * 100,
            0
          )
          const bRemainingProgress = Math.max(
            ((b.original.usageLimit - b.original.usageCount) / b.original.usageLimit) * 100,
            0
          )
          return aRemainingProgress - bRemainingProgress
        }
      },
      {
        accessorKey: 'mstMchId',
        header: 'Machine Code',
        enableEditing: false,
        GroupedCell: ({ cell, row }) => (
          <Box>
            <strong>{cell.getValue<string>()} </strong> ({row.subRows?.length})
          </Box>
        )
      },
      { accessorKey: 'mstMchComId', header: 'Com', enableEditing: false },
      { accessorKey: 'createdBy', header: 'Created By', enableEditing: false },
      { accessorKey: 'updatedBy', header: 'Updated By', enableEditing: false },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Group>
            <ActionIcon onClick={() => openEditModal(row.original)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => openDeleteModal(row.original)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        )
      }
    ],
    []
  )

  const table = useMantineReactTable({
    columns,
    data,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowSelection: true,
    rowCount: (meta as { total: number }).total || 0,
    manualPagination: true,
    manualSorting: true,
    initialState: {
      density: 'xs',
      expanded: true,
      grouping: ['mstMchId'],
      sorting: [{ id: 'mstMchId', desc: false }],
      pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
    },
    state: {
      pagination,
      isLoading,
      sorting,
      showAlertBanner: isError,
      showProgressBars: isFetching
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    mantineTableProps: { striped: 'even' }
  })

  if (isLoading) return <LoadingScreen />
  if (isError) return <>Error Fetching data</>

  return (
    <Box>
      {/* Pencarian */}
      <TextInput
        placeholder="Filter by Machine Code"
        value={mcCd || ''}
        onChange={(e) => setMcCd(e.currentTarget.value)}
        mb="md"
      />

      {/* Tambah Alat */}
      <Group justify="flex-start" mb="md">
        <Button leftSection={<IconPlus />} onClick={openAddModal}>
          Add Tool Usage
        </Button>
        <Button leftSection={<IconRefresh />} onClick={() => refetch()}>
          Refresh Data
        </Button>
        <Button leftSection={<IconEdit />} onClick={openBatchModal}>
          Update Batch
        </Button>
        <Button
          color="lightblue"
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export All Rows
        </Button>
      </Group>

      <MantineProvider theme={{ ...theme }}>
        <MantineReactTable table={table} />
      </MantineProvider>

      {/* Modal Tambah/Edit */}
      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTool ? 'Edit Tool Usage' : 'Add Tool Usage'}
        centered
        styles={{
          header: {
            backgroundColor: theme.colors.gray[1], // Use a light gray from the theme
            color: theme.colors.dark[9], // Use dark color for text
            fontSize: '1.5rem',
            padding: '1rem 2rem',
            borderBottom: `1px solid ${theme.colors.gray[3]}` // Use theme for border
          },
          body: {
            padding: '1.5rem 2rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        }}
      >
        <FormTool
          tool={editingTool}
          onSave={(newTool) => {
            if (editingTool) {
              editToolUsage({ ...newTool }, editingTool.id)
            } else {
              addToolUsage(newTool) // Call add function if adding
            }
          }}
        />
      </Modal>

      {/* Modal Batch Update */}
      <Modal
        opened={isBatchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        title="Batch Update Tool Usage"
        centered
      >
        <FormToolBatch
          onSave={(data) => {
            editToolUsageBatch(data.mcCd, data.mcComId, data.usage)
          }}
        />
      </Modal>

      {/* Modal Delete */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Tool Usage"
        centered
        styles={{
          header: {
            backgroundColor: '#f5f5f5', // Light gray background
            color: '#333', // Dark text color
            fontSize: '1.5rem', // Proportional font size
            padding: '1rem 2rem', // Responsive padding
            borderBottom: '1px solid #ddd' // Light border
          },
          body: {
            padding: '1.5rem 2rem', // Proportional padding for the body
            fontSize: '1rem', // Proportional font size
            lineHeight: '1.5' // Improved readability
          }
        }}
      >
        Are you sure you want to delete {deletingTool?.toolName}?
        <Group justify="flex-start" mt="md">
          <Button color="red" onClick={() => removeToolUsage(deletingTool?.id || 0)}>
            Yes, Delete
          </Button>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}

export default TableTools
