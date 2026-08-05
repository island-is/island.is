import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import React from 'react'
import { messages } from '../../lib/messages'

interface WaitlistsInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WaitlistsInfoModal: React.FC<WaitlistsInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="waitlists-info-modal"
      isVisible={isOpen}
      initialVisibility={false}
      onCloseModal={onClose}
      title={formatMessage(messages.waitlistsModalTitle)}
    >
      <Markdown>{formatMessage(messages.waitlistsModalBody)}</Markdown>
    </Modal>
  )
}
