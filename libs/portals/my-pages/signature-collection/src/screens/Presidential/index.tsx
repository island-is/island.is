import { Box, Divider } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useIsOwner,
} from '../../hooks'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import Intro from '../shared/Intro'
import ActionDrawer from './OwnerView/ActionDrawer'
import { useUserInfo } from '@island.is/react-spa/bff'

const collectionType = SignatureCollectionCollectionType.Presidential

const SignatureCollectionPresidential = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const user = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner(collectionType)
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    currentCollection?.id ?? '',
  )

  const isLoading =
    loadingIsOwner || loadingCurrentCollection || loadingOwnerLists

  return (
    <Box>
      {!isLoading && (
        <>
          <Intro
            title={formatMessage(m.pageTitlePresidential)}
            intro={formatMessage(m.pageIntro)}
            slug={listsForOwner?.[0]?.slug}
          />
          {!user?.profile.actor && currentCollection.isActive && (
            <ActionDrawer refetchIsOwner={refetchIsOwner} />
          )}
          <Divider />
          {isOwner?.success ? (
            <OwnerView currentCollection={currentCollection} />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </>
      )}
    </Box>
  )
}

export default SignatureCollectionPresidential
