import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'

const SignatureListsParliamentary = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitleParliamentary)}
        intro={formatMessage(m.pageDescriptionParliamentary)}
      />
      <Box marginTop={5}>
        <OwnerView />
      </Box>
    </Box>
  )
}

export default SignatureListsParliamentary
