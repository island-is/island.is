import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'

import { Form, useActionData, useNavigate, useParams } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { useEffect } from 'react'
import { PetitionPaths } from '../../../lib/paths'
import { m } from '../../../lib/messages'
import { LockListMutation } from '../../../shared/mutations/lockList.generated'

export default function LockList() {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const params = useParams()

  const actionData = useActionData() as LockListMutation
  const { isLoading, isSubmitting } = useSubmitting()

  // useEffect(() => {
  //   if (actionData?.globalError && !isLoading && !isSubmitting)
  //     toast.error(formatMessage(m.todo))
  // }, [actionData?.globalError, isSubmitting, isLoading])

  useEffect(() => {
    if (actionData) {
      actionData?.endorsementSystemLockEndorsementList
        ? toast.success(formatMessage(m.todo))
        : toast.error(formatMessage(m.todo))
      cancel()
    }
  }, [actionData])

  const cancel = () => {
    navigate(
      replaceParams({
        href: PetitionPaths.PetitionsSingle,
        params: { listId: params['listId'] },
      }),
    )
  }

  return (
    <Modal
      id="publish-client"
      isVisible
      title={formatMessage(m.todo)}
      label={formatMessage(m.todo)}
      onClose={cancel}
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
            <Button onClick={cancel} variant="ghost">
              {formatMessage(m.todo)}
            </Button>
            <Button loading={isSubmitting || isLoading} type="submit">
              {formatMessage(m.todo)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
