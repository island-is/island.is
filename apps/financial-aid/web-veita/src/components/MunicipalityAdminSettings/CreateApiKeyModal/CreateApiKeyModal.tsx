import React, { ReactNode } from 'react'
import { ModalBase, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.css'
import ActionModal from '../../ActionModal/ActionModal'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  closeModal: () => void
}

const CreateApiKeyModal = ({
  isVisible,
  onVisibilityChange,
  closeModal,
}: Props) => {
  return (
    <ActionModal
      isVisible={true}
      setIsVisible={() => console.log('asda')}
      header={'Nýr lykill'}
      hasError={false}
      errorMessage=""
      submitButtonText={'Stofna Api lykil'}
      onSubmit={() => console.log('asda')}
    >
      <div>asdajsdj</div>
    </ActionModal>
  )
}

export default CreateApiKeyModal
