import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from '../Table.css'

const TableSkeleton = () => {
  const { width } = useViewport()
  return width < theme.breakpoints.md ? (
    <>
      <Box marginTop={2}>
        <SkeletonLoader height={275} borderRadius="xs" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={275} borderRadius="xs" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={275} borderRadius="xs" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={275} borderRadius="xs" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={275} borderRadius="xs" />
      </Box>
    </>
  ) : (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
          <th className={styles.th}>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
        <tr className={styles.tableRowContainer}>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
          <td>
            <SkeletonLoader width={104} height={32} borderRadius="xs" />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default TableSkeleton
