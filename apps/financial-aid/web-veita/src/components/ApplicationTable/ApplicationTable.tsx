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
  if (applications && applications.length > 0) {
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
          {applications.map((item: any, index: number) => {
            return (
              <Link href={'application/' + item.link} key={'key-' + index}>
                <tr className={styles.link}>
                  {item?.arr && (
                    <>
                      {item.arr.map((el: ReactNode, i: number) => {
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
  } else {
    return <div>Enginn umsókn</div>
  }
}

export default ApplicationTable
