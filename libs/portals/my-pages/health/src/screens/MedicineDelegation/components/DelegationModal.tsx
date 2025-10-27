import {
  ActionCard,
  Box,
  Button,
  ModalBase,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { messages } from '../../../lib/messages'
import * as styles from './DelegationModal.css'
import { HealthDirectorateMedicineDelegationItem } from '@island.is/api/schema'

interface Props {
  id: string
  activeDelegation?: HealthDirectorateMedicineDelegationItem
  onClose?: () => void
  visible?: boolean
}

const DelegationModal: React.FC<Props> = ({
  id,
  activeDelegation,
  visible,
  onClose,
}) => {
  const { formatMessage } = useLocale()
  const [formData, setFormData] = useState<{
    nationalId?: string
    dateFrom?: Date
    dateTo?: Date
    lookup?: boolean
  } | null>({
    nationalId: activeDelegation?.nationalId ?? '',
    dateFrom: activeDelegation?.dates?.from,
    dateTo: activeDelegation?.dates?.to,
    lookup: activeDelegation?.lookup ?? false,
  })

  const closeModal = () => {
    onClose && onClose()
  }

  const submitForm = async (e?: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement form submission when service is ready
    e && e.preventDefault()
    const formData2 = e && new FormData(e.currentTarget)
    const data = formData2 && Object.fromEntries(formData2.entries())
    console.log('Form submitted', data, formData)
    toast.success(formatMessage(messages.permitDeleted))
    const error = false // Simulate error for demonstration //TODO: fix when service is ready
    if (error) {
      toast.error(formatMessage(messages.permitDeletedError))
    }
    setFormData(null)
    onClose && onClose()
  }

  return (
    <ModalBase
      baseId={id}
      isVisible={visible}
      initialVisibility={false}
      removeOnClose
      className={styles.modal}
    >
      <Box className={styles.closeButton}>
        <Button
          circle
          colorScheme="negative"
          icon="close"
          onClick={() => {
            closeModal()
          }}
          size="large"
        />
      </Box>
      <Box paddingY={8} paddingX={12}>
        <Text variant="h3" marginBottom={1}>
          {formatMessage(messages.areYouSureAboutDeletingDelegation)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(messages.youAreAboutToDeleteThisPermit)}
        </Text>

        <ActionCard
          heading={activeDelegation?.name ?? ''}
          headingVariant="h4"
          text={formatMessage(messages.permitTo, {
            arg: activeDelegation?.lookup
              ? formatMessage(messages.pickupMedicineAndLookup)
              : formatMessage(messages.pickupMedicine),
          })}
          subText={
            formatMessage(messages.medicineValidTo) +
            ' ' +
            formatDate(activeDelegation?.dates?.to)
          }
        />
        <Box display={'flex'} justifyContent="spaceBetween" marginTop={6}>
          <Box>
            <Button size="small" variant="ghost" onClick={closeModal}>
              {formatMessage(messages.cancel)}
            </Button>
          </Box>
          <Box>
            <Button
              size="small"
              onClick={() => {
                submitForm()
              }}
              colorScheme="destructive"
            >
              {formatMessage(messages.deleteDelegation)}
            </Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default DelegationModal
