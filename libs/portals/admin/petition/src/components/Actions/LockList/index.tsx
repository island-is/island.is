import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { Form, useParams, useRevalidator } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useLockListMutation } from '../../../shared/mutations/lockList.generated'

export const LockList = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const params = useParams()

  const [
    lockListMutation,
    { loading, error: mutationError },
  ] = useLockListMutation()
  const { revalidate } = useRevalidator()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await lockListMutation({
      variables: {
        input: {
          listId: params['listId'] || '',
        },
      },
    })

    if (res.data?.endorsementSystemLockEndorsementList) {
      revalidate()
      toast.success('todo')
      onClose?.()
    }
  }

  return (
    <Modal
      id="lock-list"
      isVisible={isVisible}
      title={'Læsa lista'}
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
