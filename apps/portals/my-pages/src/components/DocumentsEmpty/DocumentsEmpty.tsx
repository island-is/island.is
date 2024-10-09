import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import * as styles from './DocumentsEmpty.css'

interface Props {
  hasDelegationAccess: boolean
}

export const DocumentsEmpty = ({ hasDelegationAccess }: Props) => {
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
      <Text variant="h4">
        {hasDelegationAccess
          ? formatMessage(m.emptyDocumentsList)
          : formatMessage(m.accessNeeded)}
      </Text>
      {!hasDelegationAccess && (
        <Text textAlign="center" whiteSpace="preLine">
          {formatMessage(m.accessDeniedText)}
        </Text>
      )}
      <Box paddingTop={2}>
        {
          <img
            src={
              hasDelegationAccess
                ? './assets/images/nodata.svg'
                : './assets/images/jobsGrid.svg'
            }
            alt=""
            className={styles.img}
          />
        }
      </Box>
      {!hasDelegationAccess && (
        <Icon
          color="blue600"
          type="outline"
          icon="lockClosed"
          size="small"
          className={styles.lock}
        />
      )}
    </Box>
  )
}

export default DocumentsEmpty
