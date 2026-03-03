import { HealthDirectoratePatientDataApprovalCountry } from '@island.is/api/schema'
import { ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../lib/messages'
import { ConfirmModal } from './ConfirmModal'

interface InvalidatePermitModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  countries?: HealthDirectoratePatientDataApprovalCountry[]
  validFrom?: string
  validTo?: string
}

export const InvalidatePermitModal: React.FC<InvalidatePermitModalProps> = ({
  open,
  onClose,
  onSubmit,
  countries = [],
  validFrom,
  validTo,
}) => {
  const { formatMessage } = useLocale()

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={formatMessage(messages.areYouSureAboutInvalidatingPermit)}
      description={formatMessage(messages.youAreAboutToInvalidateThisPermit)}
      content={
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
      }
    />
  )
}
