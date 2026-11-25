import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams, useRevalidator } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  InputError,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import { IDSAdminPaths } from '../../../../lib/paths'
import { authAdminEnvironments } from '../../../../utils/environments'
import { useClient } from '../../ClientContext'
import { useDeleteClientMutation } from './DeleteClient.generated'

interface Props {
  isVisible: boolean
  onClose: () => void
}

export const DeleteClient: FC<Props> = ({ isVisible, onClose }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const { client, selectedEnvironment } = useClient()

  const { tenant: tenantId, client: clientId } = useParams() as {
    tenant: string
    client: string
  }

  const activeEnvironments = client.environments
    .filter((env) => !env.archived)
    .map((env) => env.environment)

  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([selectedEnvironment.environment])
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (isVisible) {
      setSelectedEnvironments(
        selectedEnvironment.archived ? [] : [selectedEnvironment.environment],
      )
      setError(undefined)
    }
  }, [isVisible, selectedEnvironment])

  const [deleteClientMutation, { loading, error: mutationError }] =
    useDeleteClientMutation()

  const handleEnvironmentChange = (env: AuthAdminEnvironment) => {
    setSelectedEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
    )
    setError(undefined)
  }

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    if (selectedEnvironments.length === 0) {
      setError(formatMessage(m.deleteClientEnvironmentRequired))
      return
    }

    const res = await deleteClientMutation({
      variables: {
        input: {
          tenantId,
          clientId,
          environments: selectedEnvironments,
        },
      },
    })

    if (!res.data?.deleteAuthAdminClient) {
      toast.error(formatMessage(m.errorDefault))
      return
    }

    toast.success(formatMessage(m.successDeletingClient))

    const remainingActive = activeEnvironments.filter(
      (env) => !selectedEnvironments.includes(env),
    )

    if (remainingActive.length === 0) {
      navigate(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClients,
          params: { tenant: tenantId },
        }),
      )
      return
    }

    revalidator.revalidate()
    onClose()
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

      <Box marginTop={4}>
        <Text variant="h4" marginBottom={2}>
          {formatMessage(m.deleteClientSelectEnvironments)}
        </Text>
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          columnGap={3}
          rowGap={2}
        >
          {authAdminEnvironments.map((env) => (
            <Box width="full" key={env}>
              <Checkbox
                label={env}
                name="deleteClientEnvironments"
                id={`deleteClientEnvironments.${env}`}
                value={env}
                checked={selectedEnvironments.includes(env)}
                onChange={() => handleEnvironmentChange(env)}
                disabled={!activeEnvironments.includes(env)}
                large
              />
            </Box>
          ))}
        </Box>
        {error && (
          <InputError
            id="delete-client-environments-error"
            errorMessage={error}
          />
        )}
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
          {formatMessage(m.archive)}
        </Button>
      </Box>
    </Modal>
  )
}
