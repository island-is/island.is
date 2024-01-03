import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import OwnerView from './ownerView'
import SigneeView from './signeeView'
import { useIsOwner } from '../hooks'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner()

  return (
    <div>
      {!loadingIsOwner && (
        <Box>{isOwner.success ? <OwnerView /> : <SigneeView />}</Box>
      )}
    </div>
  )
}

export default SignatureLists
