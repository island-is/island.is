import { ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../lib/messages'
import { ConfirmModal } from './ConfirmModal'

interface InvalidatePermitModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  validFrom?: string
  validTo?: string
}

export const InvalidatePermitModal: React.FC<InvalidatePermitModalProps> = ({
  open,
  onClose,
  onSubmit,
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
          backgroundColor="white"
          eyebrow={formatMessage(messages.healthDirectorate)}
          eyebrowColor="purple400"
          heading={formatMessage(messages.patientDataPermit)}
          text={formatMessage(messages.validToFrom, {
            fromDate: validFrom,
            toDate: validTo,
          })}
        />
      }
    />
  )
}
