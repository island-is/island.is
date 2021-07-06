import React, { ReactNode } from 'react'
import { Text, Icon, Box } from '@island.is/island-ui/core'
import Link from 'next/link'

import * as styles from './ApplicationsTable.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

interface PageProps {
  applications: TableBodyProps[]
  headers: TableHeadersProps[]
  className?: string
  setSortBy: (filter: any) => void
  sortBy: 'modified' | 'state'
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
            {headers && (
              <>
                {headers.map((item, index) => {
                  if (item.filterBy) {
                    return (
                      <th key={'headers-' + index}>
                        <button
                          onClick={() => {
                            setSortBy(item.filterBy)
                          }}
                          className={cn({
                            [`${styles.tablePadding}`]: true,
                            [`${styles.firstChildPadding}`]: index === 0,
                          })}
                        >
                          <Box display="flex" alignItems="center">
                            <Text color="dark300" fontWeight="semiBold">
                              {item.title}
                            </Text>

                            <Box
                              display="block"
                              opacity={0}
                              marginLeft="smallGutter"
                              className={cn({
                                [`${styles.showIcon}`]:
                                  sortBy === item.filterBy,
                              })}
                            >
                              <Icon
                                color="dark300"
                                icon="chevronDown"
                                size="small"
                                type="filled"
                              />
                            </Box>
                          </Box>
                        </button>
                      </th>
                    )
                  }
                  return (
                    <th
                      key={'headers-' + index}
                      className={cn({
                        [`${styles.tablePadding}`]: true,
                        [`${styles.firstChildPadding}`]: index === 0,
                      })}
                    >
                      <Text color="dark300" fontWeight="semiBold">
                        {item.title}
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
