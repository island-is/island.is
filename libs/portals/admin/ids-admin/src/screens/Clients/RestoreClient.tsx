import { FC } from 'react'
import { Modal } from '@island.is/react/components'
import { AlertMessage, Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useRestoreClientMutation } from './RestoreClient.generated'

interface Props {
  isVisible: boolean
  onClose: () => void
  tenantId: string
  clientId: string
  onSuccess: () => void
}

export const RestoreClient: FC<Props> = ({
  isVisible,
  onClose,
  tenantId,
  clientId,
  onSuccess,
}) => {
  const { formatMessage } = useLocale()

  const [restoreClientMutation, { loading, error: mutationError }] =
    useRestoreClientMutation()

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const res = await restoreClientMutation({
      variables: {
        input: {
          tenantId,
          clientId,
        },
      },
    })

    if (res.data?.restoreAuthAdminClient) {
      toast.success(formatMessage(m.successRestoringClient))
      onSuccess()
    } else {
      toast.error(formatMessage(m.errorDefault))
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      id="restore-client-modal"
      label={formatMessage(m.restoreClient)}
      title={formatMessage(m.restoreClient)}
      closeButtonLabel={formatMessage(m.cancel)}
      onClose={onClose}
    >
      <Box marginTop={2}>
        <AlertMessage
          type={'warning'}
          message={formatMessage(m.restoreClientAlertMessage)}
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
        <Button loading={loading} onClick={handleSubmit}>
          {formatMessage(m.restore)}
        </Button>
      </Box>
    </Modal>
  )
}
