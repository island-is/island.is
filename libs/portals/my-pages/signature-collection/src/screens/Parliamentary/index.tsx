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

  const isLoading =
    loadingCurrentCollection || loadingIsOwner || loadingOwnerLists

  return (
    <Box>
      {!isLoading && (
        <>
          <Intro
            title={formatMessage(m.pageTitleParliamentary)}
            intro={formatMessage(m.pageIntro)}
            slug={listsForOwner?.[0]?.slug}
          />
          {isOwner?.success ? (
            <OwnerView
              currentCollection={currentCollection}
              isListHolder={
                !user?.profile?.delegationType ||
                user?.profile?.delegationType?.includes(
                  AuthDelegationType.ProcurationHolder,
                )
              }
            />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </>
      )}
    </Box>
  )
}

export default SignatureCollectionParliamentary
