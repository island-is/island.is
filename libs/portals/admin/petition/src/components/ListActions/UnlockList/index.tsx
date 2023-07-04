import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { Form, useParams, useRevalidator } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useUnlockListMutation } from './unlockList.generated'

export const UnlockList = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const params = useParams()

  const [unlockListMutation, { loading }] = useUnlockListMutation()
  const { revalidate } = useRevalidator()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    try {
      const res = await unlockListMutation({
        variables: {
          input: {
            listId: params['listId'] || '',
          },
        },
      })

      if (res.data?.endorsementSystemUnlockEndorsementList) {
        revalidate()
        toast.success(m.toastUnlockSuccess.defaultMessage)
        onClose?.()
      }
    } catch (e) {
      toast.error(m.toastUnlockError.defaultMessage)
    }
  }

  return (
    <Modal
      id="unlock-list"
      isVisible={isVisible}
      title={formatMessage(m.unlockList)}
      label={formatMessage(m.unlockList)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.modalCancel)}
    >
      <Form method="post">
        <Box paddingTop={3}>
          <Text>{formatMessage(m.unlockListMessage)}</Text>
          <Text paddingTop={4} variant="h4">
            {formatMessage(m.unlockListQuestion)}
          </Text>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={7}
          >
            <Button onClick={onClose} variant="ghost">
              {formatMessage(m.modalCancel)}
            </Button>
            <Button loading={loading} onClick={handleSubmit}>
              {formatMessage(m.unlockList)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
