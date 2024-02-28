import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import OwnerView from './CandidateView'
import SigneeView from './SigneeView'
import { useGetCurrentCollection, useIsOwner } from '../hooks'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <div>
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {isOwner.success ? (
            <OwnerView currentCollection={currentCollection} />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </Box>
      )}
    </div>
  )
}

export default SignatureLists
