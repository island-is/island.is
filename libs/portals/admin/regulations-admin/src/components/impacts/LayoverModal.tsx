import { ReactNode } from 'react'
import { Box, ModalBase } from '@island.is/island-ui/core'
import { ModalHeader } from './ModalHeader'
import * as s from './Impacts.css'

// ---------------------------------------------------------------------------

export type LayoverModalProps = {
  id: string
  closeModal: () => void
  children: ReactNode
}

export const LayoverModal = (props: LayoverModalProps) => {
  const { children, closeModal, id } = props

  return (
    <ModalBase
      baseId={id}
      isVisible={true}
      initialVisibility={true}
      className={s.layoverModal}
      hideOnClickOutside={false}
      // Setting this to true breaks the edit functionality, custom esc click is handled in EditImpacts
      hideOnEsc={false}
      removeOnClose
    >
      <Box padding={[3, 3, 3, 6]}>
        <ModalHeader closeModal={closeModal} />
        {children}
      </Box>
    </ModalBase>
  )
}
