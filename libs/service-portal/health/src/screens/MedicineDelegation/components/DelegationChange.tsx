import React, { useState } from 'react'
import { Box, Text, toast } from '@island.is/island-ui/core'
import { DelegationInput } from '../utils/mockdata'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'

interface Props {
  // Define the props for your component here
  input: DelegationInput
  edit?: boolean
}

const DelegationChange: React.FC<Props> = ({ input, edit }) => {
  const { formatMessage } = useLocale()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  return (
    <Modal
      id={'medicine-delegation-crud-modal'}
      initialVisibility={false}
      toggleClose={!modalVisible}
      // title={
      //   edit
      //     ? formatMessage(messages.editDelegation)
      //     : formatMessage(messages.grantMedicineDelegation)
      // }
    >
      <Box>
        <Text>
          {edit
            ? formatMessage(messages.editDelegation)
            : formatMessage(messages.grantMedicineDelegation)}
        </Text>
      </Box>
    </Modal>
  )
}

export default DelegationChange
