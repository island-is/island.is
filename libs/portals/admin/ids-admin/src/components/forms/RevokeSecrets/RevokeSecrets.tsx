import { useCallback, useContext, useEffect } from 'react'
import { Form, useActionData, useNavigate, useParams } from 'react-router-dom'

import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'

import { m } from '../../../lib/messages'
import { IDSAdminPaths } from '../../../lib/paths'
import { ClientContext } from '../../../shared/context/ClientContext'
import { RevokeSecretsResult } from './RevokeSecrets.action'

export const RevokeSecrets = () => {
  const { formatMessage } = useLocale()
  const {
    selectedEnvironment: { environment },
  } = useContext(ClientContext)
  const actionData = useActionData() as RevokeSecretsResult
  const params = useParams()
  const navigate = useNavigate()
  const { isLoading, isSubmitting } = useSubmitting()

  const onCancel = useCallback(() => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClient,
        params: { tenant: params['tenant'], client: params['client'] },
      }),
    )
  }, [params, navigate])

  useEffect(() => {
    if (
      (actionData?.globalError || actionData?.errors) &&
      !isLoading &&
      !isSubmitting
    ) {
      toast.error(formatMessage(m.errorRevokingSecrets))
    }

    if (actionData?.data && !isLoading && !isSubmitting) {
      toast.success(formatMessage(m.successRevokingSecrets))
      onCancel()
    }
  }, [actionData, isLoading, isSubmitting, formatMessage, onCancel])

  return (
    <Modal
      isVisible
      id="revoke-secrets-modal"
      label={formatMessage(m.revokeSecrets)}
      title={formatMessage(m.revokeSecrets)}
      closeButtonLabel={formatMessage(m.closeModal)}
      onClose={onCancel}
    >
      <Text>{formatMessage(m.revokeSecretsDescription)}</Text>

      <Form method="post">
        <input type="hidden" name="environment" value={environment} />

        <Box marginTop={7} display="flex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={onCancel}>
            {formatMessage(m.cancel)}
          </Button>
          <Button
            colorScheme="destructive"
            type="submit"
            loading={isLoading || isSubmitting}
          >
            {formatMessage(m.revoke)}
          </Button>
        </Box>
      </Form>
    </Modal>
  )
}

export default RevokeSecrets
