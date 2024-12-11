import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  ModuleRegistry,
  ValueFormatterFunc,
  ValueGetterParams
} from '@ag-grid-community/core'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'
import { useMantineColorScheme } from '@mantine/core'
import { EnergyDataType } from '@renderer/pages/power-usage/power.types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

ModuleRegistry.registerModules([ClientSideRowModelModule])

const numberFormatter: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 2
  })
  return value == null ? '' : formatter.format(value)
}

const numberIdr: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2
  })
  return value == null ? '' : formatter.format(value)
}

const numberFixed: ValueFormatterFunc = ({ value }) => {
  return value == null ? '' : value.toFixed(1)
}

interface DeviceTableProps {
  data: EnergyDataType[]
}

const DeviceTable: React.FC<DeviceTableProps> = ({ data }) => {
  const { colorScheme } = useMantineColorScheme()
  const theme = colorScheme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'

  const gridApi = useRef<GridApi | null>(null)

  const gridRef = useRef<AgGridReact>(null)

  const colDefs = useMemo<ColDef[]>(
    () => [
      { headerName: 'Key', field: 'key', minWidth: 100 },
      { headerName: 'Plant', field: 'plant' },
      {
        headerName: 'LWBP1',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.day_kwh_lwbp1,
        valueFormatter: numberFormatter
      },
      {
        headerName: 'LWBP2',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.day_kwh_lwbp2,
        valueFormatter: numberFormatter
      },
      {
        headerName: 'WBP',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.day_kwh_wbp,
        valueFormatter: numberFormatter
      },
      {
        headerName: 'Kwh Day',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.day_kwh,
        valueFormatter: numberFormatter
      },
      {
        headerName: 'Kwh Total',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.total_kwh,
        valueFormatter: numberFormatter,
        minWidth: 150
      },
      {
        headerName: 'Cost',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.wbp_lwbp,
        valueFormatter: numberIdr,
        cellStyle: { fontWeight: 'bold' },
        minWidth: 150
      },
      {
        headerName: 'R (Volt)',
        field: 'sensorData.volt_rn',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.sensorData.volt_rn * 0.1,
        valueFormatter: numberFixed
      },
      {
        headerName: 'S (Volt)',
        field: 'sensorData.volt_sn',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.sensorData.volt_sn * 0.1,
        valueFormatter: numberFixed
      },
      {
        headerName: 'T (Volt)',
        field: 'sensorData.volt_tn',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.sensorData.volt_tn * 0.1,
        valueFormatter: numberFixed
      },
      {
        headerName: 'R (Ampere)',
        cellDataType: 'number',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.sensorData.phasa1_current
      },
      {
        headerName: 'S (Ampere)',
        field: 'sensorData.phasa2_current',
        cellRenderer: 'agAnimateShowChangeCellRenderer'
      },
      {
        headerName: 'T (Ampere)',
        field: 'sensorData.phasa3_current',
        cellRenderer: 'agAnimateShowChangeCellRenderer'
      },
      {
        headerName: 'THD V1N',
        field: 'sensorData.thd_v1n',
        cellRenderer: 'agAnimateShowChangeCellRenderer'
      },
      {
        headerName: 'THD V2N',
        field: 'sensorData.thd_v2n',
        cellRenderer: 'agAnimateShowChangeCellRenderer'
      },
      {
        headerName: 'THD V3N',
        field: 'sensorData.thd_v3n',
        cellRenderer: 'agAnimateShowChangeCellRenderer'
      },
      {
        headerName: 'F',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) => data.sensorData.frequency * 0.1,
        valueFormatter: numberFixed
      }
    ],
    []
  )

  let [rowData, setRowData] = useState<EnergyDataType[]>([])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      cellClass: 'align-right'
    }
  }, [])

  useEffect(() => {
    setRowData([...data])
  }, [data])

  const getRowId = useCallback<GetRowIdFunc>(({ data: { key } }: GetRowIdParams) => key, [])

  return (
    // wrapping container with theme & size
    <div className={theme} style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef}
        getRowId={getRowId}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  )
}

export default DeviceTable
