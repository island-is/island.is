import { HealthDirectoratePatientDataApprovalCountry } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'

interface InvalidatePermitModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  countries?: Omit<HealthDirectoratePatientDataApprovalCountry, 'id'>[]
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
    <Modal
      id={'invalidate-permit-modal'}
      initialVisibility={open}
      isVisible={open}
      title={formatMessage(messages.areYouSureAboutInvalidatingPermit)}
      onCloseModal={onClose}
      buttons={[
        {
          id: 'invalidate-permit-cancel-button',
          loading: false,
          onClick: () => onClose(),
          text: formatMessage(messages.cancel),
          type: 'ghost',
        },
        {
          id: 'invalidate-permit-confirm-button',
          loading: false,
          onClick: () => {
            onSubmit()
          },
          text: formatMessage(messages.confirm),
          type: 'primary',
        },
      ]}
      buttonsSpacing="spaceBetween"
      text={formatMessage(messages.youAreAboutToInvalidateThisPermit)}
    >
      <Box
        borderRadius="large"
        background="blue100"
        padding={3}
        marginBottom={6}
      >
        <Stack space={1}>
          <Text fontWeight="medium">{formatMessage(messages.permit)}</Text>
          <Text>
            {formatMessage(messages.permitValidFor, {
              country: countries.flatMap((country) => country.name).join(', '),
            })}
          </Text>
          <Text>
            {formatMessage(messages.validToFrom, {
              fromDate: validFrom,
              toDate: validTo,
            })}
          </Text>
        </Stack>
      </Box>
    </Modal>
  )
}
