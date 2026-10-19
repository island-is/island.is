import { useParams, useRevalidator } from 'react-router-dom'

import {
  AlertMessage,
  Button,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { useRestoreClientMutation } from '../../Clients/RestoreClient.generated'
import { useClient } from '../ClientContext'

export const ArchivedEnvironment = () => {
  const { formatMessage } = useLocale()
  const revalidator = useRevalidator()
  const { selectedEnvironment } = useClient()
  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }
  const [restoreClient, { loading }] = useRestoreClientMutation()
  const environment = selectedEnvironment.environment

  const handleRestore = async () => {
    if (loading) {
      return
    }

    try {
      const res = await restoreClient({
        variables: {
          input: {
            tenantId,
            clientId,
            environments: [environment],
          },
        },
      })

      if (res.data?.restoreAuthAdminClient) {
        toast.success(formatMessage(m.successRestoringClient))
        revalidator.revalidate()
      } else {
        toast.error(formatMessage(m.errorDefault))
      }
    } catch {
      toast.error(formatMessage(m.errorDefault))
    }
  }

  return (
    <AlertMessage
      type="warning"
      title={formatMessage(m.clientArchivedInEnvironment, { environment })}
      message={
        <Stack space={1}>
          <Text variant="small">
            {formatMessage(m.clientArchivedInEnvironmentDescription)}
          </Text>
          <Button
            variant="text"
            size="small"
            loading={loading}
            onClick={handleRestore}
          >
            {formatMessage(m.restoreInEnvironment, { environment })}
          </Button>
        </Stack>
      }
    />
  )
}
