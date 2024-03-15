import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as styles from './EmptyTable.css'

type Props = {
  message?: string | MessageDescriptor
  loading?: boolean
}

export const EmptyTable: React.FC<Props> = ({ message, loading }) => {
  const { formatMessage } = useLocale()

  const msg = message
    ? typeof message === 'string'
      ? message
      : formatMessage(message)
    : null

  return (
    <Box className={styles.emptyTable}>
      <Box className={styles.emptyTableText}>
        {loading && <LoadingDots />}
        {!loading && message && (
          <Text color="dark400" variant="default">
            {msg}
          </Text>
        )}
      </Box>
    </Box>
  )
}
