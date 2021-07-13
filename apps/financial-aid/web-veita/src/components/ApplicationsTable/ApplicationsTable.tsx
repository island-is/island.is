import React from 'react'

import * as styles from './ApplicationsTable.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'
import { Application } from '@island.is/financial-aid/shared'
import {
  sortByProps,
  TableHeadersProps,
} from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

interface PageProps {
  applications: Application[]
  headers: TableHeadersProps[]
  className?: string
  setSortBy(filter: string): void
  sortBy: sortByProps
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
          {applications.map((item: Application, index: number) => (
            <TableBody application={item} index={index} />
          ))}
        </tbody>
      </table>
    )
  }

  return <div>Engar umsóknir</div>
}

export default ApplicationsTable
