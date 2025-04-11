import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import { EmptyState, IntroWrapper, THJODSKRA_SLUG } from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'

const SignatureCollectionPresidential = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={formatMessage(m.pageTitlePresidential)}
        intro={formatMessage(m.pageDescriptionSignee)}
        serviceProviderTooltip={formatMessage(m.infoProviderTooltip)}
        serviceProviderSlug={THJODSKRA_SLUG}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {currentCollection?.isPresidential ? (
            isOwner.success ? (
              <OwnerView currentCollection={currentCollection} />
            ) : (
              <SigneeView currentCollection={currentCollection} />
            )
          ) : (
            <EmptyState
              title={m.noCollectionIsActive}
              description={m.noCollectionIsActiveDescription}
            />
          )}
        </Box>
      )}
    </Box>
  )
}

export default SignatureCollectionPresidential
