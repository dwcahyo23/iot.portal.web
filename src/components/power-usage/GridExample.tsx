import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColDef, ModuleRegistry, ValueParserParams } from '@ag-grid-community/core'
import { AgGridReact } from '@ag-grid-community/react'
import { useCallback, useMemo, useRef, useState } from 'react'

ModuleRegistry.registerModules([ClientSideRowModelModule])

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue)
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString()
}

function createRowData(): { a: number; b: number; c: number; d: number }[] {
  const rowData: { a: number; b: number; c: number; d: number }[] = []
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0
    })
  }
  return rowData
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null)
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<any[]>(createRowData())
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: 'Editable A',
      field: 'a',
      editable: true,
      valueParser: numberValueParser
    },
    {
      headerName: 'Editable B',
      field: 'b',
      editable: true,
      valueParser: numberValueParser
    },
    {
      headerName: 'API C',
      field: 'c',
      minWidth: 135,
      valueParser: numberValueParser,
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    },
    {
      headerName: 'API D',
      field: 'd',
      minWidth: 135,
      valueParser: numberValueParser,
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    },
    {
      headerName: 'Total',
      valueGetter: 'data.a + data.b + data.c + data.d',
      minWidth: 135,
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    },
    {
      headerName: 'Average',
      valueGetter: '(data.a + data.b + data.c + data.d) / 4',
      minWidth: 135,
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    }
  ])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      minWidth: 105,
      flex: 1,
      cellClass: 'align-right',
      valueFormatter: (params) => {
        return formatNumber(params.value)
      }
    }
  }, [])

  const onUpdateSomeValues = useCallback(() => {
    const rowCount = gridRef.current!.api.getDisplayedRowCount()
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(Math.random() * rowCount)
      const rowNode = gridRef.current!.api.getDisplayedRowAtIndex(row)!
      rowNode.setDataValue('c', Math.floor(Math.random() * 10000))
      rowNode.setDataValue('d', Math.floor(Math.random() * 10000))
    }
  }, [])

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <div style={{ marginBottom: '5px' }}>
        <button onClick={onUpdateSomeValues}>Update Some C &amp; D Values</button>
      </div>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  )
}

export default GridExample
