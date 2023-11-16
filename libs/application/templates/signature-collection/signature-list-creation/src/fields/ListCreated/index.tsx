import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import Illustration from '../../../../assets/Illustration'

export const ListCreated = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.shareList)}
        </Text>
        <CopyLink
          linkUrl={m.shareListLink.defaultMessage}
          buttonTitle={formatMessage(m.copyLink)}
        />
      </Box>

      <Box display="flex" justifyContent="center" marginY={5}>
        <Illustration />
      </Box>
    </>
  )
}

export default ListCreated
