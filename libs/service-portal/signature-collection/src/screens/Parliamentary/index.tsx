import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, THJODSKRA_SLUG } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'
import SigneeView from './SigneeView'

const SignatureListsParliamentary = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box display={'flex'}>
        <IntroHeader
          title={formatMessage(m.pageTitleParliamentary)}
          intro={formatMessage(m.pageDescriptionParliamentary)}
          serviceProviderTooltip={formatMessage(m.infoProviderTooltip)}
          serviceProviderSlug={THJODSKRA_SLUG}
        />
      </Box>
      <OwnerView />
    </Box>
  )
}

export default SignatureListsParliamentary
