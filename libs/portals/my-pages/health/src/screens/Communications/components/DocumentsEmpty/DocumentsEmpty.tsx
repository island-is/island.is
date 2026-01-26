import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import * as styles from './DocumentsEmpty.css'

export const DocumentsEmpty = () => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingTop={2}
      justifyContent="center"
      alignItems="center"
      rowGap={2}
      paddingX={2}
    >
      <Text variant="h4">{formatMessage(m.emptyDocumentsList)}</Text>

      <Box paddingTop={2}>
        {
          <img
            src={'./assets/images/nodata.svg'}
            alt=""
            className={styles.img}
          />
        }
      </Box>
    </Box>
  )
}

export default DocumentsEmpty
