import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { Form, useParams, useRevalidator } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useLockListMutation } from './lockList.generated'

export const LockList = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const params = useParams()

  const [lockListMutation, { loading }] = useLockListMutation()
  const { revalidate } = useRevalidator()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    try {
      const res = await lockListMutation({
        variables: {
          input: {
            listId: params['listId'] || '',
          },
        },
      })

      if (res.data?.endorsementSystemLockEndorsementList) {
        revalidate()
        toast.success(m.toastLockSuccess.defaultMessage)
        onClose?.()
      }
    } catch (e) {
      toast.error(m.toastLockError.defaultMessage)
    }
  }

  return (
    <Modal
      id="lock-list"
      isVisible={isVisible}
      title={formatMessage(m.lockList)}
      label={formatMessage(m.lockList)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.modalCancel)}
    >
      <Form method="post">
        <Box paddingTop={3}>
          <Text>{formatMessage(m.lockListMessage)}</Text>
          <Text paddingTop={4} variant="h4">
            {formatMessage(m.lockListQuestion)}
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
              {formatMessage(m.lockList)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
