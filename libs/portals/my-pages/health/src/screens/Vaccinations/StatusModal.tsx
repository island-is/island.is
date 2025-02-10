import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      id={'vaccinations-status-modal'}
      isVisible={isOpen}
      title="Vaccination status"
      text="Your vaccination status is not available at the moment. Please try again later."
      onCloseModal={onClose}
      toggleClose={!isOpen}
    />
  )
}

export default StatusModal
