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

const SignatureCollectionMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const collectionType = SignatureCollectionCollectionType.LocalGovernmental

  const user = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection(collectionType)
  const { isOwner } = useIsOwner(collectionType)
  const { listsForOwner } = useGetListsForOwner(collectionType, '')

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleMunicipal)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />

      {!loadingCurrentCollection && (isOwner.success || user.profile.actor) ? (
        <OwnerView
          currentCollection={currentCollection}
          collectionType={collectionType}
        />
      ) : (
        <SigneeView
          currentCollection={currentCollection}
          collectionType={collectionType}
        />
      )}
    </Box>
  )
}

export default SignatureCollectionMunicipal
