import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { Form, useParams, useRevalidator } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useUnlockListMutation } from '../../../shared/mutations/unlockList.generated'

export const UnlockList = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const params = useParams()

  const [
    unlockListMutation,
    { loading, error: mutationError },
  ] = useUnlockListMutation()
  const { revalidate } = useRevalidator()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await unlockListMutation({
      variables: {
        input: {
          listId: params['listId'] || '',
        },
      },
    })

    if (res.data?.endorsementSystemUnlockEndorsementList) {
      revalidate()
      toast.success('todo')
      onClose?.()
    }
  }

  return (
    <Modal
      id="unlock-list"
      isVisible={isVisible}
      title={formatMessage(m.unlockList)}
      label={formatMessage(m.todo)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.todo)}
    >
      <Form method="post">
        <Box paddingTop={3}>
          <Text>{formatMessage(m.todo)}</Text>
          <Text paddingTop={4} variant="h4">
            {formatMessage(m.todo)}
          </Text>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={7}
          >
            <Button onClick={onClose} variant="ghost">
              {formatMessage(m.todo)}
            </Button>
            <Button loading={loading} onClick={handleSubmit}>
              {formatMessage(m.todo)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
