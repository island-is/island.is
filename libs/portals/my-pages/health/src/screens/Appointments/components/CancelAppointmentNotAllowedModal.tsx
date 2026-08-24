import { HealthDirectorateAppointmentCancelBlockedReason } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../../lib/messages'

interface Props {
  visible: boolean
  reason?: HealthDirectorateAppointmentCancelBlockedReason
  onClose: () => void
}

const CancelAppointmentNotAllowedModal: React.FC<Props> = ({
  visible,
  reason,
  onClose,
}) => {
  const { formatMessage } = useLocale()

  const [title, text] =
    reason === HealthDirectorateAppointmentCancelBlockedReason.DeadlinePassed
      ? [
          messages.cancelAppointmentNotAllowedTitle,
          messages.cancelAppointmentNotAllowedText,
        ]
      : [
          messages.cancelAppointmentNotAllowedGenericTitle,
          messages.cancelAppointmentNotAllowedGenericText,
        ]

  return (
    <Modal
      id="cancelAppointmentNotAllowedModal"
      initialVisibility={visible}
      isVisible={visible}
      title={formatMessage(title)}
      text={formatMessage(text)}
      onCloseModal={onClose}
    />
  )
}

export default CancelAppointmentNotAllowedModal
