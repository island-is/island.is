import { MessageDescriptor } from 'react-intl'

import { Box, BoxProps, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import * as styles from './EmptyTable.css'

type Props = {
  message?: string | MessageDescriptor
  loading?: boolean
  background?: BoxProps['background']
}

export const EmptyTable: React.FC<Props> = ({
  message,
  loading,
  background,
}) => {
  const { formatMessage } = useLocale()

  const msg = message
    ? typeof message === 'string'
      ? message
      : formatMessage(message)
    : null

  return (
    <Box className={styles.emptyTable} background={background}>
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
