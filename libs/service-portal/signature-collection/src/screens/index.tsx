import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import OwnerView from './CandidateView'
import SigneeView from './SigneeView'
import { useGetCurrentCollection, useIsOwner } from '../hooks'
import { EmptyState } from '@island.is/service-portal/core'
import { m } from '../lib/messages'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <div>
      {currentCollection?.name === 'Forsetakosningar' &&
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
    </div>
  )
}

export default SignatureLists
