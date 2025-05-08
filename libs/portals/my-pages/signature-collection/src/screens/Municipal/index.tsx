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

const SignatureCollectionMunicipal = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { isOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()
  const { listsForOwner } = useGetListsForOwner('')

  return (
    <Box>
      <Intro
        title={formatMessage(m.pageTitleMunicipal)}
        intro={formatMessage(m.pageIntro)}
        slug={listsForOwner?.[0]?.slug}
      />
      {!loadingCurrentCollection && isOwner.success ? (
        <OwnerView />
      ) : (
        <SigneeView currentCollection={currentCollection} />
      )}
    </Box>
  )
}

export default SignatureCollectionMunicipal
