import { useContext, useReducer, useRef } from 'react'
import { Form, useActionData, useNavigate, useParams } from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'

import { m } from '../../../lib/messages'
import { IDSAdminPaths } from '../../../lib/paths'
import { ClientContext } from '../../../shared/context/ClientContext'
import { useCopyToClipboard } from '../../../shared/hooks/useCopyToClipboard'
import { RotateSecretResult } from './RotateSecret.action'

export const RotateSecret = () => {
  const { formatMessage } = useLocale()
  const { handleCopy } = useCopyToClipboard()
  const {
    selectedEnvironment: { environment },
  } = useContext(ClientContext)
  const params = useParams()
  const navigate = useNavigate()
  const actionData = useActionData() as RotateSecretResult
  const { isLoading, isSubmitting } = useSubmitting()
  const [revokeOldSecrets, toggleRevokeOldSecret] = useReducer(
    (state) => !state,
    false,
  )
  const secretRef = useRef<HTMLInputElement>(null)
  const isResult = !!actionData?.data?.decryptedValue

  if (
    (actionData?.globalError || actionData?.errors) &&
    !isLoading &&
    !isSubmitting
  ) {
    toast.error(formatMessage(m.errorRotatingSecret))
  }

  const onCancel = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClient,
        params: { tenant: params['tenant'], client: params['client'] },
      }),
    )
  }

  const modalTitle = isResult
    ? formatMessage(m.newSecret)
    : formatMessage(m.rotateSecret)

  return (
    <Modal
      isVisible
      id="rotate-secret-modal"
      label={modalTitle}
      title={modalTitle}
      closeButtonLabel={formatMessage(m.closeModal)}
      onClose={onCancel}
    >
      <Text>
        {formatMessage(
          isResult ? m.rotatedSecretDescription : m.rotateSecretDescription,
          {
            br: <br />,
          },
        )}
      </Text>

      <Form method="post">
        <input type="hidden" name="environment" value={environment} />

        <Box marginTop={4}>
          {isResult ? (
            <Stack space={1}>
              <Input
                ref={secretRef}
                readOnly
                type="text"
                size="sm"
                name="clientId"
                value={actionData?.data?.decryptedValue}
                label={formatMessage(m.clientSecret)}
                buttons={[
                  {
                    name: 'copy',
                    label: 'copy',
                    type: 'outline',
                    onClick: () => handleCopy(secretRef),
                  },
                ]}
              />
              <Text variant={'small'}>
                {formatMessage(m.clientSecretDescription)}
              </Text>
            </Stack>
          ) : (
            <>
              <Checkbox
                label={formatMessage(m.revokeExistingSecrets)}
                name="revokeOldSecrets"
                checked={revokeOldSecrets}
                onChange={toggleRevokeOldSecret}
                value="true"
              />
              {revokeOldSecrets && (
                <Box marginTop={3}>
                  <AlertMessage
                    type="info"
                    message={formatMessage(m.rotateSecretInfoAlert)}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        <Box marginTop={7} display="flex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={onCancel}>
            {formatMessage(isResult ? m.close : m.cancel)}
          </Button>
          {!isResult && (
            <Button
              colorScheme={revokeOldSecrets ? 'destructive' : 'default'}
              type="submit"
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
            >
              {formatMessage(revokeOldSecrets ? m.rotate : m.generate)}
            </Button>
          )}
        </Box>
      </Form>
    </Modal>
  )
}

export default RotateSecret
