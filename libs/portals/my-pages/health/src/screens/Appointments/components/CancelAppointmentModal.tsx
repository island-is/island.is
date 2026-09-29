import { useLocale } from '@island.is/localization'
import {
  formatDate,
  getTime,
  InfoCard,
  Modal,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../../lib/messages'
import { mapWeekday } from '../../../utils/mappers'
import { AppointmentDetailFieldsFragment } from '../AppointmentDetail.generated'

interface Props {
  appointment: AppointmentDetailFieldsFragment
  visible: boolean
  loading?: boolean
  onClose: () => void
  onSubmit: () => void
}

const CancelAppointmentModal: React.FC<Props> = ({
  appointment,
  visible,
  loading,
  onClose,
  onSubmit,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="cancelAppointmentModal"
      initialVisibility={visible}
      isVisible={visible}
      title={formatMessage(messages.cancelAppointmentModalTitle)}
      text={formatMessage(messages.cancelAppointmentModalText)}
      onCloseModal={onClose}
      buttons={[
        {
          id: 'cancel-appointment-cancel-button',
          onClick: onClose,
          text: formatMessage(messages.cancel),
          type: 'ghost',
        },
        {
          id: 'cancel-appointment-confirm-button',
          loading,
          onClick: onSubmit,
          text: formatMessage(messages.confirm),
          type: 'primary',
        },
      ]}
      buttonsSpacing="spaceBetween"
    >
      <InfoCard
        variant="appointment"
        title={appointment.title ?? ''}
        appointment={{
          weekday: mapWeekday(appointment.date ?? '', formatMessage),
          date: formatDate(appointment.date ?? ''),
          time: getTime(appointment.date ?? ''),
          location: {
            label: appointment.location?.name ?? '',
          },
        }}
      />
    </Modal>
  )
}

export default CancelAppointmentModal
