import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetCurrentCollection,
  useGetListsForOwner,
  useIsOwner,
} from '../../hooks'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import { m } from '../../lib/messages'
import Intro from '../shared/Intro'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/react-spa/bff'

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

  const isLoading =
    loadingCurrentCollection || loadingIsOwner || loadingOwnerLists

  return (
    <Box>
      {!isLoading && (
        <>
          <Intro
            title={formatMessage(m.pageTitleMunicipal)}
            intro={formatMessage(m.pageIntro)}
            slug={listsForOwner?.[0]?.slug}
          />
          {isOwner?.success || user?.profile.actor ? (
            <OwnerView currentCollection={currentCollection} />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </>
      )}
    </Box>
  )
}

export default SignatureCollectionMunicipal
