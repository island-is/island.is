import { Application } from '@island.is/application/types'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import Illustration from '../../assets/Illustration'

const ListCreated = ({ application }: { application: Application }) => {
  const { formatMessage } = useLocale()
  const createdList =
    (application.externalData.createEndorsementList?.data as any) || ''
  const baseUrl =
    document.location.origin === 'http://localhost:4242'
      ? 'http://localhost:4200'
      : document.location.origin
  const baseUrlForm = `${baseUrl}/undirskriftalistar/`

  return (
    <Stack space={5}>
      <Box>
        <Text marginY={2} variant="h3">
          {formatMessage(m.linkToList)}
        </Text>
        <CopyLink
          linkUrl={baseUrlForm + createdList?.id}
          buttonTitle={formatMessage(m.copyLinkButton)}
        />
      </Box>
      <Box marginTop={5} display="flex" justifyContent="center">
        <Illustration />
      </Box>
    </Stack>
  )
}

export default ListCreated
