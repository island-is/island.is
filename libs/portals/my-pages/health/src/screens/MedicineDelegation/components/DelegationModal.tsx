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
import { Delegation } from '../utils/mockdata'
import * as styles from './DelegationModal.css'

interface Props {
  id: string
  activeDelegation?: Delegation
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
    nationalId: activeDelegation?.nationalId,
    dateFrom: activeDelegation?.dateFrom,
    dateTo: activeDelegation?.dateTo,
    lookup: activeDelegation?.delegationType.includes('/'),
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
          heading={activeDelegation?.name}
          headingVariant="h4"
          text={formatMessage(messages.permitTo, {
            arg: activeDelegation?.delegationType,
          })}
          subText={
            formatMessage(messages.medicineValidTo) +
            ' ' +
            formatDate(activeDelegation?.dateTo)
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
