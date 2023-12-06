import { useLocale } from '@island.is/localization'
import { Box, Button, DatePicker, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'

const ListActions = () => {
  const { formatMessage } = useLocale()
  const [modalChangeDateIsOpen, setModalChangeDateIsOpen] = useState(false)
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)

  return (
    <Box marginTop={10}>
      <Modal
        id="changeEndTime"
        isVisible={modalChangeDateIsOpen}
        title={'Framlengja lokadag'}
        label={'Framlengja lokadag'}
        onClose={() => setModalChangeDateIsOpen(false)}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <DatePicker
            locale="is"
            label={formatMessage(m.listEndTime)}
            selected={new Date()}
            placeholderText=""
          />
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button onClick={() => setModalChangeDateIsOpen(false)}>
              {'Framlengja lokadag'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        id="submitReview"
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

      <Box display="flex" justifyContent="spaceBetween" marginTop={10}>
        <Button
          icon="calendar"
          iconType="outline"
          onClick={() => setModalChangeDateIsOpen(true)}
        >
          {'Framlengja lokadag'}
        </Button>
        <Button
          icon="lockClosed"
          iconType="outline"
          variant="ghost"
          colorScheme="destructive"
          onClick={() => setModalSubmitReviewIsOpen(true)}
        >
          {formatMessage(m.confirmListReviewed)}
        </Button>
      </Box>
    </Box>
  )
}

export default ListActions
