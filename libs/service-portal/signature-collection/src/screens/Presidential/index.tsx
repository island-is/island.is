import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import OwnerView from './OwnerView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import { EmptyState, IntroHeader } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { CollectionType } from '../../lib/constants'
import SigneeView from '../shared/SigneeView'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {currentCollection?.name === CollectionType.Presidential &&
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
