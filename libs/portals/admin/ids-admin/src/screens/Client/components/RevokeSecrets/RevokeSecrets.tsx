import { useParams, useRevalidator } from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal, ModalProps } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { useRevokeSecretsMutation } from './RevokeSecrets.generated'
import { useClient } from '../../ClientContext'

export const RevokeSecrets = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const {
    selectedEnvironment: { environment },
  } = useClient()
  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }
  const [revokeSecretsMutation, { loading, error: mutationError }] =
    useRevokeSecretsMutation()
  const { revalidate } = useRevalidator()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await revokeSecretsMutation({
      variables: {
        input: {
          environment,
          tenantId,
          clientId,
        },
      },
    })

    if (res.data?.revokeAuthAdminClientSecrets) {
      revalidate()
      toast.success(formatMessage(m.successRevokingSecrets))
      onClose?.()
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      id="revoke-secrets-modal"
      label={formatMessage(m.revokeSecrets)}
      title={formatMessage(m.revokeSecrets)}
      closeButtonLabel={formatMessage(m.closeModal)}
      onClose={onClose}
    >
      <Text>{formatMessage(m.revokeSecretsDescription)}</Text>

      {mutationError && (
        <Box marginTop={4}>
          <AlertMessage message={formatMessage(m.errorDefault)} type="error" />
        </Box>
      )}

      <Box marginTop={7} display="flex" justifyContent="spaceBetween">
        <Button variant="ghost" onClick={onClose}>
          {formatMessage(m.cancel)}
        </Button>
        <Button
          colorScheme="destructive"
          loading={loading}
          onClick={handleSubmit}
        >
          {formatMessage(m.revoke)}
        </Button>
      </Box>
    </Modal>
  )
}
