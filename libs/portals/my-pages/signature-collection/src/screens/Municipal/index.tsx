import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useGetListsForUser,
  useGetSignedList,
  useIsOwner,
} from '../../hooks'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import { m } from '../../lib/messages'
import Intro from '../shared/Intro'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Skeleton } from '../../lib/skeletons'
import { EmptyState } from '@island.is/portals/my-pages/core'

const collectionType = SignatureCollectionCollectionType.LocalGovernmental

const SignatureCollectionMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const user = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { isOwner, loadingIsOwner } = useIsOwner(collectionType)
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    '',
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
    loadingUserLists ||
    loadingSignedLists

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleMunicipal)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {isOwner?.success || user?.profile.actor ? (
        isOwner?.success ? (
          <OwnerView
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

export default SignatureCollectionMunicipal
