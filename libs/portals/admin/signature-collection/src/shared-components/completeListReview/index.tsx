import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useToggleListReviewMutation } from './toggleListReview.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'
import { ListStatus } from '../../lib/utils'

const CompleteListReview = ({
  listId,
  listStatus,
}: {
  listId: string
  listStatus: string
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)
  const listReviewed =
    listStatus &&
    (listStatus === ListStatus.Reviewed || listStatus === ListStatus.Inactive)
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
      toast.success(
        listReviewed
          ? formatMessage(m.toggleReviewSuccessToggleBack)
          : formatMessage(m.toggleReviewSuccess),
      )
    },
    onError: () => {
      toast.error(formatMessage(m.toggleReviewError))
    },
  })

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="checkmark" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.confirmListReviewed)}</Text>
              <Text marginBottom={2}>
                Þegar búið er að fara yfir meðmæli er hakað við hér.
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalSubmitReviewIsOpen(true)}
              >
                {formatMessage(m.confirmListReviewed)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
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

export default CompleteListReview
