import { useCallback, useReducer, useRef, useState } from 'react'
import { useParams, useRevalidator } from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal, ModalProps } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { useCopyToClipboard } from '../../../../hooks/useCopyToClipboard'
import { useRotateSecretMutation } from './RotateSecret.generated'
import { useClient } from '../../ClientContext'

export const RotateSecret = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const { copyToClipboard } = useCopyToClipboard()
  const { revalidate } = useRevalidator()
  const {
    selectedEnvironment: { environment },
  } = useClient()
  const { client: clientId, tenant: tenantId } = useParams() as {
    tenant: string
    client: string
  }
  const [revokeOldSecrets, toggleRevokeOldSecret] = useReducer(
    (state) => !state,
    false,
  )
  const secretRef = useRef<HTMLInputElement>(null)
  const [rotateSecretMutation, { loading, error: mutationError }] =
    useRotateSecretMutation()
  const [newSecret, setNewSecret] = useState('')

  const modalTitle = newSecret
    ? formatMessage(m.newSecret)
    : formatMessage(m.rotateSecret)

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const { data } = await rotateSecretMutation({
      variables: {
        input: {
          tenantId,
          clientId,
          environment,
          revokeOldSecrets,
        },
      },
    })

    if (data?.rotateAuthAdminClientSecret?.decryptedValue) {
      setNewSecret(data.rotateAuthAdminClientSecret.decryptedValue)
      revokeOldSecrets && toggleRevokeOldSecret()
    }
  }

  const handleClose = useCallback(() => {
    if (newSecret) {
      revalidate()
    }

    setNewSecret('')
    onClose?.()
  }, [onClose, newSecret, revalidate])

  return (
    <Modal
      isVisible={isVisible}
      id="rotate-secret-modal"
      label={modalTitle}
      title={modalTitle}
      closeButtonLabel={formatMessage(m.closeModal)}
      onClose={handleClose}
    >
      <Text>
        {formatMessage(
          newSecret ? m.rotatedSecretDescription : m.rotateSecretDescription,
          {
            br: <br />,
          },
        )}
      </Text>

      <Box marginTop={4}>
        {newSecret ? (
          <Stack space={1}>
            <Input
              ref={secretRef}
              readOnly
              type="text"
              size="sm"
              name="clientId"
              value={newSecret}
              label={formatMessage(m.clientSecret)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => copyToClipboard(secretRef),
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

      {mutationError && (
        <Box marginTop={4}>
          <AlertMessage message={formatMessage(m.errorDefault)} type="error" />
        </Box>
      )}

      <Box
        marginTop={7}
        display="flex"
        justifyContent={newSecret ? 'flexEnd' : 'spaceBetween'}
      >
        <Button variant="ghost" onClick={handleClose}>
          {formatMessage(newSecret ? m.close : m.cancel)}
        </Button>
        {!newSecret && (
          <Button
            colorScheme={revokeOldSecrets ? 'destructive' : 'default'}
            loading={loading}
            onClick={handleSubmit}
          >
            {formatMessage(revokeOldSecrets ? m.rotate : m.generate)}
          </Button>
        )}
      </Box>
    </Modal>
  )
}
