import { HealthDirectoratePatientDataApprovalCountry } from '@island.is/api/schema'
import { ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
  countries?: HealthDirectoratePatientDataApprovalCountry[]
  validFrom?: string
  validTo?: string
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onSubmit,
  countries = [],
  loading = false,
  validFrom,
  validTo,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id={'confirm-permit-modal'}
      initialVisibility={open}
      isVisible={open}
      title={formatMessage(messages.addNewPermitTitle)}
      onCloseModal={onClose}
      buttons={[
        {
          id: 'confirm-permit-cancel-button',
          loading: false,
          onClick: () => onClose(),
          text: formatMessage(messages.cancel),
          type: 'ghost',
        },
        {
          id: 'confirm-permit-confirm-button',
          loading: loading,
          onClick: () => {
            onSubmit()
          },
          text: formatMessage(messages.confirm),
          type: 'primary',
        },
      ]}
      buttonsSpacing="spaceBetween"
    >
      <ActionCard
        date={formatMessage(messages.validToFrom, {
          fromDate: validFrom,
          toDate: validTo,
        })}
        heading={formatMessage(messages.permit)}
        text={formatMessage(messages.permitValidFor, {
          country: countries.map((country) => country.name).join(', '),
        })}
      />
    </Modal>
  )
}
