import { Modal, ModalProps } from '@island.is/react/components'
import {
  AlertMessage,
  Box,
  Button,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteClientMutation } from './DeleteClient.generated'
import { useClient } from '../../ClientContext'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../../../lib/paths'

export const DeleteClient = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }

  const {
    selectedEnvironment: { environment },
  } = useClient()

  const [
    deleteClientMutation,
    { loading, error: mutationError },
  ] = useDeleteClientMutation()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await deleteClientMutation({
      variables: {
        input: {
          tenantId,
          clientId,
          environment,
        },
      },
    })

    if (res.data?.deleteAuthAdminClient) {
      toast.success(formatMessage(m.successDeletingClient))
      navigate(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClients,
          params: {
            tenant: tenantId,
          },
        }),
      )
    } else {
      toast.error(formatMessage(m.errorDefault))
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      id="delete-client-modal"
      label={formatMessage(m.deleteClient, { environment: environment })}
      title={formatMessage(m.deleteClient, { environment: environment })}
      closeButtonLabel={formatMessage(m.closeDeleteModal)}
      onClose={onClose}
    >
      <Text>{formatMessage(m.deleteClientDescription)}</Text>

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
          {formatMessage(m.delete)}
        </Button>
      </Box>
    </Modal>
  )
}
