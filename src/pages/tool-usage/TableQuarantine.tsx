import {
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
import { IconLock, IconRefresh } from '@tabler/icons-react'
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  useFetchToolQurantineQuery,
  useLockQurantineMutation,
  useUpdateToolUsageMutation
} from './@tool.api'

export interface ToolUsage extends EntityToolUsageInterface {
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

const TableQuarantine = () => {
  const dispatch = useDispatch()
  const [mcCd, setMcCd] = useState<string | undefined>(undefined)
  const [mcComId, setMcComId] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const [selectedToolId, setSelectedToolId] = useState<number | null>(null)
  const [showLockQuarantineModal, setShowLockQuarantineModal] = useState(false)
  const [showResetToolUsageModal, setShowResetToolUsageModal] = useState(false)

  const theme = useMantineTheme()

  const {
    data: { data: data = [], meta = {} } = {},
    isError,
    isLoading,
    isFetching,
    refetch
  } = useFetchToolQurantineQuery({
    mcCd,
    mcComId,
    isLock: false,
    page: pagination.pageIndex,
    perPage: pagination.pageSize
  })

  const [
    lockQurantine,
    {
      isLoading: LoadingLockQurantine,
      isError: ErrorLockQurantine,
      isSuccess: SuccessLockQurantine
    }
  ] = useLockQurantineMutation()
  const [
    updateToolUsage,
    {
      isLoading: LoadingUpdateToolUsage,
      isError: ErrorUpdateToolUsage,
      isSuccess: SuccessUpdateToolUsage
    }
  ] = useUpdateToolUsageMutation()

  useEffect(() => {
    const notifications = [
      {
        success: SuccessLockQurantine,
        error: ErrorLockQurantine,
        successMessage: 'Tool quarantined successfully!',
        errorMessage: 'Failed to quarantine tool.'
      },
      {
        success: SuccessUpdateToolUsage,
        error: ErrorUpdateToolUsage,
        successMessage: 'Tool usage reset successfully!',
        errorMessage: 'Failed to reset tool usage.'
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
    SuccessLockQurantine,
    ErrorLockQurantine,
    SuccessUpdateToolUsage,
    ErrorUpdateToolUsage,
    dispatch
  ])

  useEffect(() => {
    if (mcCd !== undefined) {
      refetch()
    }
  }, [mcCd, refetch])

  const handleLockQuarantine = async (toolId: number) => {
    setSelectedToolId(toolId)
    setShowLockQuarantineModal(true)
  }

  const confirmLockQuarantine = async () => {
    if (selectedToolId) {
      await lockQurantine({ id: selectedToolId })
      setShowLockQuarantineModal(false)
      setShowResetToolUsageModal(true) // Show reset modal after lock
    }
  }

  const confirmResetToolUsage = async () => {
    if (selectedToolId) {
      await updateToolUsage({ id: selectedToolId, data: { usageCount: 0, isLock: false } })
      setShowResetToolUsageModal(false)
      setSelectedToolId(null)
    }
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
          const remainingProgress = Math.max(((usageLimit - usageCount) / usageLimit) * 100, 0)
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
      { accessorKey: 'mstMchId', header: 'Machine Code' },
      { accessorKey: 'toolQurantine.reason', header: 'Quarantine Reason', enableEditing: false },
      { accessorKey: 'mstMchComId', header: 'Com' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Button
            leftSection={<IconLock />}
            color="red"
            onClick={() => handleLockQuarantine(row.original.id)}
          >
            Lock Quarantine
          </Button>
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
    rowCount: (meta as { total: number }).total || 0,
    manualPagination: true,
    manualSorting: true,
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
      <TextInput
        placeholder="Filter by Machine Code"
        value={mcCd || ''}
        onChange={(e) => setMcCd(e.currentTarget.value)}
        mb="md"
      />
      <Group justify="flex-start" mb="md">
        <Button leftSection={<IconRefresh />} onClick={() => refetch()}>
          Refresh Data
        </Button>
      </Group>
      <MantineProvider theme={{ ...theme }}>
        <MantineReactTable table={table} />
      </MantineProvider>

      {/* Lock Quarantine Modal */}
      <Modal
        opened={showLockQuarantineModal}
        onClose={() => setShowLockQuarantineModal(false)}
        title="Lock Quarantine"
        centered
      >
        <Button onClick={confirmLockQuarantine} loading={LoadingLockQurantine}>
          Confirm Lock
        </Button>
      </Modal>

      {/* Reset Tool Usage Modal */}
      <Modal
        opened={showResetToolUsageModal}
        onClose={() => setShowResetToolUsageModal(false)}
        title="Reset Tool Usage"
        centered
      >
        <Group justify="apart">
          <Button onClick={confirmResetToolUsage}>Confirm</Button>
          <Button variant="default" onClick={() => setShowResetToolUsageModal(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}

export default TableQuarantine
