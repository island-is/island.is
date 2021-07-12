import React from 'react'

import * as styles from './ApplicationsTable.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'

interface sortByProps {
  selected: 'modified' | 'state'
  sorted: 'asc' | 'dsc'
}

interface PageProps {
  applications: TableBodyProps[]
  headers: TableHeadersProps[]
  className?: string
  setSortBy: (filter: any) => void
  sortBy: sortByProps
}

interface TableBodyProps {
  listElement: JSX.Element[]
  link: string
}

interface TableHeadersProps {
  filterBy?: string | undefined
  title: string
}

const ApplicationsTable: React.FC<PageProps> = ({
  applications,
  headers,
  className,
  setSortBy,
  sortBy,
}) => {
  const router = useRouter()

  if (applications && applications.length > 0) {
    return (
      <table
        className={cn({
          [`${styles.tableContainer}`]: true,
          [`${className}`]: true,
        })}
        key={router.pathname}
      >
        <thead>
          <tr>
            {headers.map((item, index) => (
              <TableHeaders
                header={item}
                index={index}
                setSortBy={setSortBy}
                sortBy={sortBy}
              />
            ))}
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {applications.map((item: TableBodyProps, index: number) => (
            <TableBody application={item} index={index} />
          ))}
        </tbody>
      </table>
    )
  }

  return <div>Engar umsóknir</div>
}

export default ApplicationsTable
