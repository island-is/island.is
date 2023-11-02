import { FC } from 'react'
import { Modal } from '@island.is/react/components'
import { AlertMessage, Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteClientMutation } from './DeleteClient.generated'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../../../lib/paths'

interface Props {
  isVisible: boolean
  onClose: () => void
  deleteOnAllEnvironments?: boolean
}

export const DeleteClient: FC<Props> = ({ isVisible, onClose }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }

  const [deleteClientMutation, { loading, error: mutationError }] =
    useDeleteClientMutation()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await deleteClientMutation({
      variables: {
        input: {
          tenantId,
          clientId,
        },
      },
    })

    // If there is at least one success, we consider it a success
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
      label={formatMessage(m.deleteClient)}
      title={formatMessage(m.deleteClient)}
      closeButtonLabel={formatMessage(m.closeDeleteModal)}
      onClose={onClose}
    >
      <Box marginTop={2}>
        <AlertMessage
          type={'warning'}
          message={formatMessage(m.deleteClientAlertMessage)}
        />
      </Box>

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
