import React, { useState } from 'react'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { DelegationInput } from '../utils/mockdata'
import { m, Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'

interface Props {
  // Define the props for your component here
  input?: DelegationInput
  edit?: boolean
  modalVisible: boolean
  setModalVisible: (value: boolean) => void
}

const DelegationModal: React.FC<Props> = ({
  input,
  edit,
  modalVisible,
  setModalVisible,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Modal
      id={'medicine-delegation-crud-modal'}
      initialVisibility={false}
      toggleClose={!modalVisible}
      title={
        edit
          ? formatMessage(messages.editDelegation)
          : formatMessage(messages.grantMedicineDelegation)
      }
      buttons={[
        {
          id: 'DelegationModalDecline',
          type: 'ghost' as const,
          text: formatMessage(m.buttonCancel),
          onClick: () => {
            setModalVisible(false)
          },
        },
        {
          id: 'DelegationModalDelete',
          type: 'ghost' as const,
          text: formatMessage(messages.deleteDelegation),
          colorScheme: 'destructive',
          icon: 'trash',
          onClick: () => {
            setModalVisible(false)
          },
        },

        {
          id: 'DelegationModalAccept',
          type: 'primary' as const,
          text: formatMessage(m.submit),
          onClick: () => {
            setModalVisible(false)
            // service
          },
          align: 'right' as const,
        },
      ]}
    >
      <Box></Box>
    </Modal>
  )
}

export default DelegationModal
