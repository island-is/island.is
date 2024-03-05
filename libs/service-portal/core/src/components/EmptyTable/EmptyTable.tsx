import { Box, Text, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as styles from './EmptyTable.css'

type Props = {
  message: string | MessageDescriptor
  loading?: boolean
}

export const EmptyTable: React.FC<Props> = ({ message, loading = false }) => {
  const { formatMessage } = useLocale()

  const msg = typeof message === 'string' ? message : formatMessage(message)

  return (
    <Box className={styles.emptyTable}>
      <Box className={styles.emptyTableText}>
        {loading ? (
          <LoadingDots />
        ) : (
          <Text color="dark400" variant="default">
            {msg}
          </Text>
        )}
      </Box>
    </Box>
  )
}
