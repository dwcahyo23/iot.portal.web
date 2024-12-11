import { Box, Button, Group, MantineProvider, TextInput, useMantineTheme } from '@mantine/core'
import LoadingScreen from '@renderer/components/LoadingScreen/LoadingScreen'
import { EntityToolUsageInterface } from '@renderer/types/toolUsage'
import { IconRefresh } from '@tabler/icons-react'
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFetchToolQurantineQuery } from './@tool.api'

export interface ToolUsage extends EntityToolUsageInterface {
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

const TableHistory = () => {
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
    isLock: true,
    page: pagination.pageIndex,
    perPage: pagination.pageSize
  })

  useEffect(() => {
    if (mcCd !== undefined) {
      refetch()
    }
  }, [mcCd, refetch])

  const columns = useMemo<MRT_ColumnDef<ToolUsage>[]>(
    () => [
      { accessorKey: 'toolName', header: 'Tool Name' },
      { accessorKey: 'usageCount', header: 'Usage Count' },
      { accessorKey: 'usageLimit', header: 'Limit' },
      { accessorKey: 'mstMchId', header: 'Machine Code' },
      { accessorKey: 'toolQurantine.reason', header: 'Quarantine Reason', enableEditing: false },
      { accessorKey: 'mstMchComId', header: 'Com' },
      {
        accessorKey: 'createdAt',
        header: 'Created At'
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At'
      },
      { accessorKey: 'createdBy', header: 'createdBy' },
      { accessorKey: 'updatedBy', header: 'updatedBy' }
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
    </Box>
  )
}

export default TableHistory
