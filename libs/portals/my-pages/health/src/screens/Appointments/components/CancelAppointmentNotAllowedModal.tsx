import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../../lib/messages'

interface Props {
  visible: boolean
  onClose: () => void
}

const CancelAppointmentNotAllowedModal: React.FC<Props> = ({
  visible,
  onClose,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="cancelAppointmentNotAllowedModal"
      initialVisibility={visible}
      isVisible={visible}
      title={formatMessage(messages.cancelAppointmentNotAllowedTitle)}
      text={formatMessage(messages.cancelAppointmentNotAllowedText)}
      onCloseModal={onClose}
    />
  )
}

export default CancelAppointmentNotAllowedModal
