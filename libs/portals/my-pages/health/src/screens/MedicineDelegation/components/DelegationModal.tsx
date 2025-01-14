import React, { ReactElement, useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  DatePicker,
  Input,
  Text,
  Button,
  ModalBase,
} from '@island.is/island-ui/core'
import { Delegation } from '../utils/mockdata'
import { m } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import * as styles from './DelegationModal.css'

interface Props {
  id: string
  activeDelegation?: Delegation
  disclosure?: ReactElement
  visible?: boolean
}

const DelegationModal: React.FC<Props> = ({
  id,
  activeDelegation,
  disclosure,
  visible,
}) => {
  const { formatMessage } = useLocale()
  const [formData, setFormData] = useState<{
    nationalId?: string
    date?: Date
    lookup?: boolean
  } | null>({
    nationalId: activeDelegation?.nationalId,
    date: activeDelegation?.date,
    lookup: activeDelegation?.delegationType.includes('/'),
  })
  const [modalVisible, setModalVisible] = useState<boolean>(!!visible)

  const closeModal = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    setModalVisible(!!visible)
  }, [visible])

  const submitForm = async (e?: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement form submission when service is ready
    e && e.preventDefault()
    const formData2 = e && new FormData(e.currentTarget)
    const data = formData2 && Object.fromEntries(formData2.entries())
    setFormData(null)
    setModalVisible(false)
  }

  return (
    <ModalBase
      baseId={id}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={(visibility) => {
        setModalVisible(visibility)
      }}
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
        <Text variant="h3" marginBottom={5}>
          {activeDelegation
            ? formatMessage(messages.editDelegation)
            : formatMessage(messages.grantMedicineDelegation)}
        </Text>
        <form onSubmit={submitForm}>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Box width="full" marginRight={1}>
              <Input
                type="number"
                name="delegationMedicineModalNationalId"
                value={formData?.nationalId}
                label={formatMessage(m.natreg)}
                size="xs"
                required
                maxLength={9}
              />
              <Text variant="small" color="dark300">
                {activeDelegation?.name ?? 'Nonni Nonnason'}
              </Text>
            </Box>
            <Box width="full" marginLeft={1}>
              <DatePicker
                label={formatMessage(m.validTo)}
                name="delegationMedicineModalDateTo"
                required
                placeholderText={formatMessage(m.chooseDate)}
                selected={formData?.date}
                size="xs"
              />
            </Box>
          </Box>
          <Box marginTop={2} marginBottom={6}>
            <Checkbox
              label={formatMessage(messages.medicineDelegationLookup)}
              name="delegationMedicineModalLookup"
              checked={formData?.lookup}
            />
          </Box>
          <Box display="flex" flexDirection="row" marginTop={2}>
            <Box>
              <Button
                id="delegationModalDecline"
                type="button"
                variant="ghost"
                size="small"
                onClick={() => {
                  closeModal()
                }}
              >
                {formatMessage(m.buttonCancel)}
              </Button>
            </Box>
            {activeDelegation && (
              <Box paddingLeft={2}>
                <Button
                  id="delegationModalDelete"
                  type="button"
                  variant="ghost"
                  colorScheme="destructive"
                  size="small"
                  onClick={() => {
                    closeModal()
                  }}
                >
                  {formatMessage(messages.deleteDelegation)}
                </Button>
              </Box>
            )}
            <Box marginLeft="auto" paddingLeft={2}>
              <Button
                id="delegationModalDelete"
                type="submit"
                variant="primary"
                size="small"
              >
                {formatMessage(m.submit)}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </ModalBase>
  )
}

export default DelegationModal
