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
              {header.map((item) => {
                return (
                  <th className={styles.tablePadding}>
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

      <tbody>
        {applications && (
          <>
            {applications.map((item: [ReactNode]) => {
              return (
                <Link href="application/bla">
                  <tr className={styles.link}>
                    {item.map((el: ReactNode) => {
                      return <td className={styles.tablePadding}>{el}</td>
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
