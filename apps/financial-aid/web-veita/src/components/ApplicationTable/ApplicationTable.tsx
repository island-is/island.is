import React, { ReactNode, useContext } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './ApplicationTable.treat'

import cn from 'classnames'

interface PageProps {
  applications: any //WIP
  header: String[]
  className?: ReactNode
}

const ApplicationTable: React.FC<PageProps> = ({
  applications,
  header,
  className,
}) => {
  const router = useRouter()

  return (
    <table
      className={cn({
        [`${styles.tableContainer}`]: true,
        [`${className}`]: true,
      })}
    >
      <thead>
        <tr>
          {header && (
            <>
              {header.map((item, index) => {
                return (
                  <th
                    key={'header-' + index}
                    // className={styles.tablePadding}
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
        {applications && (
          <>
            {applications.map((item: any, index: number) => {
              return (
                <Link href={'application/' + item.link}>
                  <tr className={styles.link} key={'id-' + item.link}>
                    {item.arr.map((el: ReactNode, index: number) => {
                      return (
                        <td
                          className={cn({
                            [`${styles.tablePadding}`]: true,
                            [`${styles.firstChildPadding}`]: index === 0,
                          })}
                        >
                          {el}
                        </td>
                      )
                    })}
                  </tr>
                </Link>
              )
            })}
          </>
        )}
      </tbody>
    </table>
  )
}

export default ApplicationTable
