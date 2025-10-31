import { HealthDirectorateMedicineDelegationItem } from '@island.is/api/schema'
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
import React from 'react'
import { messages } from '../../../lib/messages'
import { useDeleteMedicineDelegationMutation } from '../MedicineDelegation.generated'
import * as styles from './DelegationModal.css'

interface Props {
  id: string
  activeDelegation?: HealthDirectorateMedicineDelegationItem
  onClose?: () => void
  onSubmit?: () => void
  visible?: boolean
}

const DelegationModal: React.FC<Props> = ({
  id,
  activeDelegation,
  visible,
  onClose,
  onSubmit,
}) => {
  const { formatMessage } = useLocale()

  const [deleteDelegation, { loading: deleting }] =
    useDeleteMedicineDelegationMutation()

  const closeModal = () => {
    onClose && onClose()
  }

  const submitForm = async () => {
    if (activeDelegation?.nationalId) {
      await deleteDelegation({
        variables: {
          input: {
            nationalId: activeDelegation?.nationalId,
          },
        },
      })
        .then((response) => {
          if (
            response.data?.healthDirectorateMedicineDelegationDelete.success
          ) {
            toast.success(formatMessage(messages.permitDeleted))
            onSubmit && onSubmit()
          } else {
            toast.error(formatMessage(messages.permitDeletedError))
          }
        })
        .catch(() => {
          toast.error(formatMessage(messages.permitDeletedError))
        })
    }
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
              onClick={submitForm}
              colorScheme="destructive"
              loading={deleting}
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
