import { Box, BoxProps, LoadingDots, Text } from '@island.is/island-ui/core'

import * as styles from './EmptyTable.css'

type Props = {
  message?: string
  loading?: boolean
  background?: BoxProps['background']
}

export const EmptyTable: React.FC<Props> = ({
  message,
  loading,
  background,
}) => {
  return (
    <Box className={styles.emptyTable} background={background}>
      <Box className={styles.divider} />
      <Box className={styles.emptyTableText}>
        {loading && <LoadingDots />}
        {!loading && message && (
          <Text color="dark400" variant="default">
            {message}
          </Text>
        )}
      </Box>
      <Box className={styles.divider} />
    </Box>
  )
}
