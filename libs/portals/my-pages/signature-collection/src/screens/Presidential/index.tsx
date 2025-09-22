import { Box, Divider } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useGetListsForUser,
  useGetSignedList,
  useIsOwner,
} from '../../hooks'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import Intro from '../shared/Intro'
import ActionDrawer from './OwnerView/ActionDrawer'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Skeleton } from '../../lib/skeletons'
import { EmptyState } from '@island.is/portals/my-pages/core'

const collectionType = SignatureCollectionCollectionType.Presidential

const SignatureCollectionPresidential = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const user = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { isOwner, loadingIsOwner } = useIsOwner(collectionType)
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    currentCollection?.id ?? '',
  )
  const { listsForUser, loadingUserLists } = useGetListsForUser(
    collectionType,
    currentCollection?.id ?? '',
  )
  const { signedLists, loadingSignedLists } = useGetSignedList(collectionType)

  const isLoading =
    loadingIsOwner ||
    loadingCurrentCollection ||
    loadingOwnerLists ||
    loadingUserLists ||
    loadingSignedLists

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitlePresidential)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {isOwner?.success || user?.profile.actor ? (
        isOwner?.success ? (
          <>
            <ActionDrawer
              candidateId={listsForOwner?.[0]?.candidate?.id}
              collectionType={collectionType}
            />
            <Divider />
            <OwnerView
              collectionType={collectionType}
              listsForOwner={listsForOwner}
              signedLists={signedLists}
            />
          </>
        ) : (
          <EmptyState
            title={m.noCollectionIsActive}
            description={m.noCollectionIsActiveDescription}
          />
        )
      ) : (
        <SigneeView
          collectionType={collectionType}
          signedLists={signedLists}
          listsForUser={listsForUser}
        />
      )}
    </Box>
  )
}

export default SignatureCollectionPresidential
