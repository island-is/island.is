import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Text } from '@island.is/island-ui/core'
import {
  IntroWrapper,
  THJODSKRA_SLUG,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'

const SignatureListsMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner()
  const userInfo = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={'Test'}
        intro={'Test'}
        serviceProviderTooltip={'Test'}
        serviceProviderSlug={THJODSKRA_SLUG}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          <Text variant="h2">Sveitastjórnarkosningar</Text>
        </Box>
      )}
    </Box>
  )
}

export default SignatureListsMunicipal
