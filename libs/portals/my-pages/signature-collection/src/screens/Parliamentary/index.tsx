import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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

const SignatureCollectionParliamentary = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const collectionType = SignatureCollectionCollectionType.Parliamentary

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner(collectionType)
  const userInfo = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(SignatureCollectionCollectionType.Parliamentary)
  const { listsForOwner } = useGetListsForOwner(
    collectionType,
    currentCollection?.id ?? '',
  )

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleParliamentary)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {isOwner.success ? (
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
