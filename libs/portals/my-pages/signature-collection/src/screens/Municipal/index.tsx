import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroWrapper, THJODSKRA_SLUG } from '@island.is/portals/my-pages/core'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'

const SignatureListsMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { isOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={'Meðmælasafnanir fyrir sveitarstjórnarkosningar'}
        intro={
          'Hér eru upplýsingar um hlekk á söfnunina, stöðuna og yfirlit yfir umsjónaraðila.'
        }
        serviceProviderSlug={THJODSKRA_SLUG}
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
