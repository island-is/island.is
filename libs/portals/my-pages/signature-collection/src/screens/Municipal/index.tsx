import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroWrapper, THJODSKRA_SLUG } from '@island.is/portals/my-pages/core'
import { useIsOwner } from '../../hooks'
import OwnerView from './OwnerView'

const SignatureListsMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { isOwner } = useIsOwner()

  return (
    <Box>
      <IntroWrapper
        title={'Meðmælasafnanir fyrir sveitarstjórnarkosningar'}
        intro={
          'Hér eru upplýsingar um hlekk á söfnunina, stöðuna og yfirlit yfir umsjónaraðila.'
        }
        serviceProviderSlug={THJODSKRA_SLUG}
      />
      {isOwner.success && <OwnerView />}
    </Box>
  )
}

export default SignatureListsMunicipal
