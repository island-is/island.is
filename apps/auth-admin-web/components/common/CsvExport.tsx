import React, { useState, useEffect, useRef, Fragment } from 'react'
import { CSVLink } from 'react-csv'

interface HeaderType {
  label: string
  key: string
}
interface CsvExportProps {
  exportMethod: any
  children?: Node
  filename?: string
  disable?: boolean
  headers?: HeaderType[]
  label?: string
  classes?: any
  transform?: (data: any[]) => any[]
}

type Props = CsvExportProps

const CsvExport = ({
  exportMethod,
  children,
  disable,
  label,
  filename,
  headers,
  transform,
}: Props) => {
  const [csvData, setCsvData]: any[] = useState([])
  const csvInstance = useRef<any | null>(null)

  const asyncExportMethod = async () => {
    let data = await exportMethod()
    if (transform) {
      data = transform(data)
    }
    setCsvData(data)
  }

  useEffect(() => {
    if (
      csvData &&
      csvInstance &&
      csvInstance.current &&
      csvInstance.current.link
    ) {
      setTimeout(() => {
        csvInstance.current.link.click()
        setCsvData([])
      })
    }
  }, [csvData])

  return (
    <Fragment>
      <div
        onClick={() => {
          if (disable) return
          asyncExportMethod()
        }}
      >
        {label ? <button>{label}</button> : children}
      </div>
      {csvData.length > 0 ? (
        <CSVLink
          data={csvData}
          headers={headers || Object.keys(csvData[0])}
          filename={filename || 'export.csv'}
          ref={csvInstance}
        />
      ) : undefined}
    </Fragment>
  )
}

export default CsvExport
