import { Box, Button, Card, Group, Stack, TextInput } from '@mantine/core'
import { EntityEquipmentDailyInspectionInfo } from '@renderer/types/@threeview/EquipmentDailyInspectionInfo'
import { IconDownload } from '@tabler/icons-react'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import {
  MRT_ColumnDef,
  MRT_Row,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { useMemo, useState } from 'react'
import { useLazyFetchEquipmentDailyInspectionInfoQuery } from './@machine.three-view.api'

function TableEquipmentDailyInspectionInfo() {
  const [mchId, setMchId] = useState('')
  const [fetchData, { data: { list = [] } = {}, isLoading, isFetching }] =
    useLazyFetchEquipmentDailyInspectionInfoQuery()

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true
  })

  const handleExportRows = (rows: MRT_Row<EntityEquipmentDailyInspectionInfo>[]) => {
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
    const transformedList = list.map((item) => {
      const transformedItem: Record<string, string | number | boolean | null> = {}
      Object.keys(item).forEach((key) => {
        const value = item[key as keyof EntityEquipmentDailyInspectionInfo]
        transformedItem[key] = value instanceof Date ? value.toISOString() : value
      })
      return transformedItem
    })

    const csv = generateCsv(csvConfig)(transformedList)
    download(csvConfig)(csv)
  }

  const columns = useMemo<MRT_ColumnDef<EntityEquipmentDailyInspectionInfo>[]>(
    () => [
      { accessorKey: 'mchChkNo', header: 'Machine Check No' },
      { accessorKey: 'chkPlanNo', header: 'Check Plan No' },
      { accessorKey: 'mchId', header: 'Machine ID' },
      { accessorKey: 'dispSeq', header: 'Display Sequence' },
      { accessorKey: 'attSeq', header: 'Attribute Sequence' },
      { accessorKey: 'attName', header: 'Attribute Name' },
      { accessorKey: 'startDate', header: 'Start Date' },
      { accessorKey: 'endDate', header: 'End Date' },
      { accessorKey: 'cycleType', header: 'Cycle Type' },
      { accessorKey: 'chkRev', header: 'Check Revision' },
      { accessorKey: 'chkType', header: 'Check Type' },
      { accessorKey: 'chkClass', header: 'Check Class' },
      { accessorKey: 'chkStd', header: 'Check Standard' },
      { accessorKey: 'planCode', header: 'Plan Code' },
      { accessorKey: 'chkTime', header: 'Check Time' },
      { accessorKey: 'chkCycle', header: 'Check Cycle' },
      { accessorKey: 'cycleUnit', header: 'Cycle Unit' },
      { accessorKey: 'lsl', header: 'LSL' },
      { accessorKey: 'usl', header: 'USL' },
      { accessorKey: 'chkVal', header: 'Check Value' }
    ],
    []
  )

  // Handle refetch on button click
  const handleFetchData = () => {
    if (mchId) {
      fetchData({ mchId })
    }
  }

  const table = useMantineReactTable({
    columns,
    data: list,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    initialState: {
      density: 'xs',
      showColumnFilters: true,
      showGlobalFilter: true,
      pagination: {
        pageIndex: 0,
        pageSize: 15
      }
    },
    mantineTableProps: { striped: 'even' },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        style={(theme) => ({
          display: 'flex',
          gap: theme.spacing.md,
          padding: theme.spacing.sm,
          flexWrap: 'wrap'
        })}
      >
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
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export Selected Rows
        </Button>
      </Box>
    )
  })

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Group justify="flex-start" align="end" gap="xs">
          <TextInput
            label="Machine ID"
            placeholder="Enter Machine ID"
            value={mchId}
            onChange={(event) => setMchId(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleFetchData}
            disabled={!mchId}
            loading={isFetching}
            mt="xs"
            styles={{
              root: {
                height: '36px', // Adjust to match TextInput height
                paddingInline: '1rem'
              }
            }}
          >
            Go
          </Button>
        </Group>

        <MantineReactTable table={table} />
      </Stack>
    </Card>
  )
}

export default TableEquipmentDailyInspectionInfo
