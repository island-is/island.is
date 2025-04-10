import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  THJODSKRA_SLUG as providerSlug,
} from '@island.is/portals/my-pages/core'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import { m } from '../../lib/messages'

const SignatureListsMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { isOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={formatMessage(m.pageTitleMunicipal)}
        intro={formatMessage(m.pageIntroMunicipal)}
        serviceProviderSlug={providerSlug}
      />
      {!loadingCurrentCollection && isOwner.success ? (
        <OwnerView currentCollection={currentCollection} />
      ) : (
        <SigneeView currentCollection={currentCollection} />
      )}
    </Box>
  )
}

export default SignatureListsMunicipal
