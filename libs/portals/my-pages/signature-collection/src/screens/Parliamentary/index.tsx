import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useGetListsForUser,
  useGetSignedList,
  useIsOwner,
} from '../../hooks'
import { useUserInfo } from '@island.is/react-spa/bff'
import Intro from '../shared/Intro'
import {
  AuthDelegationType,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { Skeleton } from '../../lib/skeletons'
import { EmptyState } from '@island.is/portals/my-pages/core'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const SignatureCollectionParliamentary = () => {
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
    loadingCurrentCollection ||
    loadingIsOwner ||
    loadingOwnerLists ||
    loadingSignedLists ||
    loadingUserLists

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleParliamentary)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {isOwner?.success || user?.profile.actor ? (
        isOwner?.success ? (
          <OwnerView
            isListHolder={
              !user?.profile?.delegationType ||
              user?.profile?.delegationType?.includes(
                AuthDelegationType.ProcurationHolder,
              )
            }
            currentCollection={currentCollection}
            listsForOwner={listsForOwner}
            signedLists={signedLists}
          />
        ) : (
          <EmptyState
            title={m.noCollectionIsActive}
            description={m.noCollectionIsActiveDescription}
          />
        )
      ) : (
        <SigneeView
          collectionType={collectionType}
          listsForUser={listsForUser}
          signedLists={signedLists}
        />
      )}
    </Box>
  )
}

export default SignatureCollectionParliamentary
