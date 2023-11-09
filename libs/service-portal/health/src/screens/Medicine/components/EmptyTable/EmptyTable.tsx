import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as styles from './EmptyTable.css'

type Props = {
  message: string | MessageDescriptor
}

export const EmptyTable: React.FC<Props> = ({ message }) => {
  const { formatMessage } = useLocale()

  const msg = typeof message === 'string' ? message : formatMessage(message)

  return (
    <Box className={styles.emptyTable}>
      <Box className={styles.emptyTableText}>
        <Text color="dark400" variant="default">
          {msg}
        </Text>
      </Box>
    </Box>
  )
}
