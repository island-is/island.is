import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import {
  EmptyState,
  IntroWrapper,
  THJODSKRA_SLUG,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const collectionType = SignatureCollectionCollectionType.Presidential

const SignatureCollectionPresidential = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner(collectionType)
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)

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
          {currentCollection?.collectionType ===
          SignatureCollectionCollectionType.Presidential ? (
            isOwner.success ? (
              <OwnerView
                refetchIsOwner={refetchIsOwner}
                currentCollection={currentCollection}
              />
            ) : (
              <SigneeView
                currentCollection={currentCollection}
                collectionType={collectionType}
              />
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
