import { useLocale } from '@island.is/localization'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'

const ActionReviewComplete = () => {
  const { formatMessage } = useLocale()
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)

  return (
    <Box marginTop={10}>
      <Box display="flex" justifyContent="flexEnd">
        <Box marginLeft={3}>
          <Button
            icon="lockClosed"
            iconType="outline"
            colorScheme="destructive"
            variant="ghost"
            onClick={() => setModalSubmitReviewIsOpen(true)}
          >
            {formatMessage(m.confirmListReviewed)}
          </Button>
        </Box>
      </Box>
      <Modal
        id="reviewComplete"
        isVisible={modalSubmitReviewIsOpen}
        title={formatMessage(m.confirmListReviewed)}
        label={formatMessage(m.confirmListReviewed)}
        onClose={() => setModalSubmitReviewIsOpen(false)}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>Lorem ipsum</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              colorScheme="destructive"
              onClick={() => setModalSubmitReviewIsOpen(false)}
            >
              {formatMessage(m.confirmListReviewed)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionReviewComplete
