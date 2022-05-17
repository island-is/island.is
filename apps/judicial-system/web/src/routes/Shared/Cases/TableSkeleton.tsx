import React from 'react'

import { SkeletonLoader, Box } from '@island.is/island-ui/core'

import * as styles from './Cases.css'

const TableSkeleton = () => {
  return (
    <>
      <div className={styles.logoContainer}>
        <SkeletonLoader width={200} height={64} borderRadius="standard" />
        <SkeletonLoader width={200} height={64} borderRadius="standard" />
      </div>
      <Box marginBottom={3}>
        <SkeletonLoader width={200} height={40} borderRadius="standard" />
      </Box>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
            <th className={styles.th}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
          <tr className={styles.tableRowContainer}>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
            <td className={styles.td}>
              <SkeletonLoader width={104} height={32} borderRadius="standard" />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default TableSkeleton
