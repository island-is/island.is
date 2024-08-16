import { useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../../lib/messages'

const DeletePersonModal = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Box>
      <Button
        variant="text"
        icon="trash"
        iconType="outline"
        size="small"
        onClick={() => setModalIsOpen(true)}
      />
      <Modal
        id="deletePerson"
        isVisible={modalIsOpen}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
        label={''}
      >
        <Text marginBottom={2} variant="h2">
          {formatMessage(m.deleteManager)}
        </Text>
        <Text marginBottom={5}>
          {formatMessage(m.deleteManagerDescription)}
        </Text>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button colorScheme="destructive">{formatMessage(m.delete)}</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default DeletePersonModal
