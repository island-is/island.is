import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'

const CancelCollection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={10} display={'flex'} justifyContent={'center'}>
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        disclosure={
          <Button
            variant="ghost"
            size="small"
            onClick={() => setModalIsOpen(true)}
          >
            {formatMessage(m.cancelCollectionButton)}
          </Button>
        }
      >
        <Text variant="h1" paddingTop={5}>
          {formatMessage(m.modalMessage)}
        </Text>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button onClick={() => setModalIsOpen(false)}>
            {formatMessage(m.modalConfirmButton)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CancelCollection
