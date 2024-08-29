import { Box } from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'
import { useNavigate } from 'react-router-dom'
import { DelegationAdminPaths } from '../../lib/paths'

const DelegationAdminCreate = () => {
  const navigate = useNavigate()
  const onCancle = () => {
    navigate(DelegationAdminPaths.Root)
  }

  return (
    <Modal
      title={'Create DELEGATIONS'}
      isVisible
      label={'MODAL TEST LABEL'}
      closeButtonLabel={'Close'}
      onClose={onCancle}
      id={'delegation-admin-create'}
    >
      <Box>Placeholder for future create modal</Box>
    </Modal>
  )
}

export default DelegationAdminCreate
