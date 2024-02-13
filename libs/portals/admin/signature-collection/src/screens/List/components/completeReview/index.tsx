import { useLocale } from '@island.is/localization'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { m } from '../../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useToggleListReviewMutation } from './toggleListReview.generated'
import { useRevalidator } from 'react-router-dom'
import { ListStatus } from '../../../../lib/utils'

const ActionReviewComplete = ({
  listId,
  listStatus,
}: {
  listId: string
  listStatus: string
}) => {
  const { formatMessage } = useLocale()
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)
  const [toggleListReviewMutation] = useToggleListReviewMutation()
  const { revalidate } = useRevalidator()

  const toggleReview = async () => {
    try {
      const res = await toggleListReviewMutation({
        variables: {
          input: {
            id: listId,
          },
        },
      })
      if (res.data?.signatureCollectionAdminToggleListReview.success) {
        toast.success(formatMessage(m.toggleReviewSuccess))
        setModalSubmitReviewIsOpen(false)
        revalidate()
      } else {
        toast.error(formatMessage(m.toggleReviewError))
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box marginTop={10}>
      <Box display="flex" justifyContent="center">
        <Box>
          <Button
            iconType="outline"
            variant="text"
            disabled={
              listStatus !== ListStatus.Reviewed &&
              listStatus !== ListStatus.InReview
            }
            icon={
              listStatus === ListStatus.Reviewed ? 'lockOpened' : 'lockClosed'
            }
            colorScheme={
              listStatus === ListStatus.Reviewed ? 'default' : 'destructive'
            }
            onClick={() => setModalSubmitReviewIsOpen(true)}
          >
            {listStatus === ListStatus.Reviewed
              ? formatMessage(m.confirmListReviewedToggleBack)
              : formatMessage(m.confirmListReviewed)}
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
          <Text>{formatMessage(m.listReviewedModalDescription)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              colorScheme="destructive"
              onClick={() => toggleReview()}
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
