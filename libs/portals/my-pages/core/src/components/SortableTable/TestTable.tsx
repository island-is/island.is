import { Table as T } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile/useIsMobile'
import MobileTable from './Mobile/MobileTable'

interface TestTableProps {
  data: Array<Record<string, any>>
  headers: Array<{ key: string; label: string }>
  expandable?: boolean
}

const TestTable: React.FC<TestTableProps> = ({
  data,
  headers,
  expandable = false,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
  } | null>(null)

  const { isMobile } = useIsMobile()

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return data
  }, [data, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  if (isMobile) {
    // return (
    //   <MobileTable>
    //     {sortedData.map((item, index) => (
    //       <div key={index}>
    //         {headers.map((header) => (
    //           <div key={header.key}>
    //             <strong>{header.label}:</strong> {item[header.key]}
    //           </div>
    //         ))}
    //       </div>
    //     ))}
    //   </MobileTable>
    // )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {headers.map((header) => (
            <T.HeadData
              key={header.key}
              onClick={() => requestSort(header.key)}
            >
              {header.label}
            </T.HeadData>
          ))}
        </T.Row>
      </T.Head>
      <T.Body>
        {sortedData.map((item, index) => (
          <T.Row key={index}>
            {headers.map((header) => (
              <T.Data key={header.key}>{item[header.key]}</T.Data>
            ))}
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}

export default TestTable
