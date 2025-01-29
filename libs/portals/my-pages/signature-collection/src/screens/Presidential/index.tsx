import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import { EmptyState, IntroWrapper } from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import SigneeView from '../shared/SigneeView'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {currentCollection?.isPresidential &&
      !loadingIsOwner &&
      !loadingCurrentCollection ? (
        <Box>
          {isOwner.success ? (
            <OwnerView currentCollection={currentCollection} />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </Box>
      ) : (
        <EmptyState
          title={m.noCollectionIsActive}
          description={m.noCollectionIsActiveDescription}
        />
      )}
    </Box>
  )
}

export default SignatureLists
