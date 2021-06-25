import React, { ReactNode } from 'react'
import { Text } from '@island.is/island-ui/core'
import Link from 'next/link'

import * as styles from './ApplicationsTable.treat'

import cn from 'classnames'

interface PageProps {
  applications: TableBodyProps[]
  headers: string[]
  className?: string
  [key: string]: any
}

interface TableBodyProps {
  listElement: JSX.Element[]
  link: string
}

const ApplicationsTable: React.FC<PageProps> = ({
  applications,
  headers,
  className,
  key,
}) => {
  if (applications && applications.length > 0) {
    return (
      <table
        className={cn({
          [`${styles.tableContainer}`]: true,
          [`${className}`]: true,
        })}
        key={key}
      >
        <thead>
          <tr>
            {headers && (
              <>
                {headers.map((item, index) => {
                  return (
                    <th
                      key={'headers-' + index}
                      className={cn({
                        [`${styles.tablePadding}`]: true,
                        [`${styles.firstChildPadding}`]: index === 0,
                      })}
                    >
                      <Text color="dark300" fontWeight="semiBold">
                        {item}
                      </Text>
                    </th>
                  )
                })}
              </>
            )}
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {applications.map((item: TableBodyProps, index: number) => {
            return (
              <Link href={'application/' + item.link} key={'key-' + index}>
                <tr className={styles.link}>
                  {item?.listElement && (
                    <>
                      {item.listElement.map((el: ReactNode, i: number) => {
                        return (
                          <td
                            className={cn({
                              [`${styles.tablePadding}`]: true,
                              [`${styles.firstChildPadding}`]: i === 0,
                            })}
                            key={'tr-' + index + '-td-' + i}
                          >
                            {el}
                          </td>
                        )
                      })}
                    </>
                  )}
                </tr>
              </Link>
            )
          })}
        </tbody>
      </table>
    )
  }

  return <div>Engar umsóknir</div>
}

export default ApplicationsTable
