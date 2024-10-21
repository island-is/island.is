import { useLocale } from '@island.is/localization'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useToggleListReviewMutation } from './toggleListReview.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'
import { ListStatus } from '../../lib/utils'
import LockList from './lockList'

const ActionReviewComplete = ({
  listId,
  listStatus,
}: {
  listId: string
  listStatus: string
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)
  const listReviewed = listStatus && listStatus === ListStatus.Reviewed
  const modalText = listReviewed
    ? formatMessage(m.confirmListReviewedToggleBack)
    : formatMessage(m.confirmListReviewed)

  const [toggleListReview, { loading }] = useToggleListReviewMutation({
    variables: {
      input: {
        listId,
      },
    },
    onCompleted: () => {
      setModalSubmitReviewIsOpen(false)
      revalidate()
      toast.success(formatMessage(m.toggleReviewSuccess))
    },
    onError: () => {
      toast.error(formatMessage(m.toggleReviewError))
    },
  })

  return (
    <Box marginTop={12}>
      <Box display="flex" justifyContent="spaceBetween">
        <LockList listId={listId} listStatus={listStatus} />
        <Button
          iconType="outline"
          variant="ghost"
          icon={listReviewed ? 'reload' : 'checkmark'}
          onClick={() => setModalSubmitReviewIsOpen(true)}
          disabled={listStatus === ListStatus.Active}
        >
          {modalText}
        </Button>
      </Box>
      <Modal
        id="toggleReviewComplete"
        isVisible={modalSubmitReviewIsOpen}
        title={modalText}
        onClose={() => setModalSubmitReviewIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>
            {listReviewed
              ? formatMessage(m.listReviewedModalDescriptionToggleBack)
              : formatMessage(m.listReviewedModalDescription)}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => toggleListReview()}
              loading={loading}
              icon={listReviewed ? 'reload' : 'checkmark'}
            >
              {modalText}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionReviewComplete
