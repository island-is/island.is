import React, { ReactElement, useState } from 'react'
import {
  Box,
  Checkbox,
  DatePicker,
  Input,
  toast,
} from '@island.is/island-ui/core'
import { Delegation, DelegationInput } from '../utils/mockdata'
import { m, Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'

interface Props {
  // Define the props for your component here
  modalVisible: boolean
  toggleModal: (arg: string) => void
  activeDelegation?: Delegation
  disclosure?: ReactElement
}

const DelegationModal: React.FC<Props> = ({
  modalVisible,
  toggleModal,
  activeDelegation,
  disclosure,
}) => {
  const { formatMessage } = useLocale()
  const [formData, setFormData] = useState<{
    nationalId?: string
    date?: Date
    lookup?: boolean
  } | null>(null)

  const submitForm = () => {
    console.log(formData)
    setFormData(null)
  }
  return (
    <Modal
      id="medicine-delegation-crud-modal"
      initialVisibility={false}
      toggleClose={!modalVisible}
      onCloseModal={() => toggleModal('onCloseModal')}
      disclosure={disclosure}
      title={
        activeDelegation
          ? formatMessage(messages.editDelegation)
          : formatMessage(messages.grantMedicineDelegation)
      }
      buttons={[
        {
          id: 'DelegationModalDecline',
          type: 'ghost' as const,
          text: formatMessage(m.buttonCancel),
          onClick: () => {
            toggleModal('buttonCancel')
          },
        },
        {
          id: 'DelegationModalDelete',
          type: 'ghost' as const,
          text: formatMessage(messages.deleteDelegation),
          colorScheme: 'destructive',
          icon: 'trash',
          onClick: () => {
            toggleModal('buttonDelete')
          },
        },

        {
          id: 'DelegationModalAccept',
          type: 'primary' as const,
          text: formatMessage(m.submit),
          onClick: () => {
            submitForm()
            toggleModal('buttonAccept')
          },
          align: 'right' as const,
        },
      ]}
      text=""
    >
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Box width="full" marginRight={1}>
            <Input
              type="number"
              name="delegationMedicineNationalId"
              value={activeDelegation?.nationalId ?? formData?.nationalId}
              label={formatMessage(m.natreg)}
              size="xs"
              required
              maxLength={9}
              onChange={(e) => {
                setFormData({ ...formData, nationalId: e.target.value })
              }}
            />
          </Box>
          <Box width="full" marginLeft={1}>
            <DatePicker
              label={formatMessage(m.validTo)}
              name="delegationMedicineDate"
              required
              placeholderText={formatMessage(m.chooseDate)}
              handleChange={(date) => {
                setFormData({ ...formData, date: date })
              }}
              selected={
                activeDelegation?.date
                  ? new Date(activeDelegation.date)
                  : formData?.date
              }
              size="xs"
            />
          </Box>
        </Box>
        <Box marginTop={2} marginBottom={6}>
          <Checkbox
            label={formatMessage(messages.medicineDelegationLookup)}
            name="delegationMedicineLookup"
            checked={
              activeDelegation?.delegationType.includes('/')
                ? true
                : formData?.lookup
            }
            onChange={() => {
              setFormData({ ...formData, lookup: !formData?.lookup })
            }}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default DelegationModal
