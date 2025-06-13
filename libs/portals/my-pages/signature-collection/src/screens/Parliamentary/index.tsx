import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { EmptyState } from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useIsOwner,
} from '../../hooks'
import { useUserInfo } from '@island.is/react-spa/bff'
import Intro from '../shared/Intro'
import {
  AuthDelegationType,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const SignatureCollectionParliamentary = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner(collectionType)
  const userInfo = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { listsForOwner } = useGetListsForOwner(collectionType, '')

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleParliamentary)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {currentCollection?.collectionType ===
          SignatureCollectionCollectionType.Presidential ? (
            <EmptyState
              title={m.noCollectionIsActive}
              description={m.noCollectionIsActiveDescription}
            />
          ) : isOwner.success ? (
            <OwnerView
              refetchIsOwner={refetchIsOwner}
              currentCollection={currentCollection}
              isListHolder={
                !userInfo?.profile?.delegationType ||
                userInfo?.profile?.delegationType?.includes(
                  AuthDelegationType.ProcurationHolder,
                )
              }
            />
          ) : (
            <SigneeView
              currentCollection={currentCollection}
              collectionType={collectionType}
            />
          )}
        </Box>
      )}
    </Box>
  )
}

export default SignatureCollectionParliamentary
