import React from 'react'

import { SkeletonLoader, Box } from '@island.is/island-ui/core'

import * as styles from './Cases.css'
import { theme } from '@island.is/island-ui/theme'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'

const TableSkeleton = () => {
  const { width } = useViewport()
  return (
    <>
      <div className={styles.logoContainer}>
        <SkeletonLoader width={200} height={64} borderRadius="standard" />
        <SkeletonLoader width={200} height={64} borderRadius="standard" />
      </div>
      <Box marginBottom={3}>
        <SkeletonLoader width={200} height={40} borderRadius="standard" />
      </Box>
      {width < theme.breakpoints.md ? (
        <>
          <Box marginTop={2}>
            <SkeletonLoader height={275} borderRadius="standard" />
          </Box>
          <Box marginTop={2}>
            <SkeletonLoader height={275} borderRadius="standard" />
          </Box>
          <Box marginTop={2}>
            <SkeletonLoader height={275} borderRadius="standard" />
          </Box>
          <Box marginTop={2}>
            <SkeletonLoader height={275} borderRadius="standard" />
          </Box>
          <Box marginTop={2}>
            <SkeletonLoader height={275} borderRadius="standard" />
          </Box>
        </>
      ) : (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
              <th className={styles.th}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
            <tr className={styles.tableRowContainer}>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
              <td className={styles.td}>
                <SkeletonLoader
                  width={104}
                  height={32}
                  borderRadius="standard"
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  )
}

export default TableSkeleton
