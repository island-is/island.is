import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useIsOwner,
} from '../../hooks'
import { EmptyState } from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import Intro from '../shared/Intro'

const collectionType = SignatureCollectionCollectionType.Presidential

const SignatureCollectionPresidential = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner(collectionType)
  const { listsForOwner } = useGetListsForOwner(
    collectionType,
    currentCollection?.id ?? '',
  )

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitlePresidential)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {currentCollection?.collectionType ===
          SignatureCollectionCollectionType.Presidential ? (
            isOwner?.success ? (
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
