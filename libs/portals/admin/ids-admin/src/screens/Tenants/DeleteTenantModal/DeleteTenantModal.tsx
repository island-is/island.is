import React, { useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../lib/messages'
import { useDeleteTenantMutation } from '../Tenants.generated'

type DeleteTenantModalProps = {
  tenantId: string
  displayName?: string | null
  onClose: () => void
  onDeleted: () => void
}

const DeleteTenantModal = ({
  tenantId,
  displayName,
  onClose,
  onDeleted,
}: DeleteTenantModalProps) => {
  const { formatMessage } = useLocale()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteTenant, { loading }] = useDeleteTenantMutation({
    // Refetch the tenants list so it reflects the removal; `awaitRefetchQueries`
    // makes the mutation promise resolve only after the refetch is done, so
    // the caller's navigation happens against the updated cache.
    refetchQueries: ['Tenants'],
    awaitRefetchQueries: true,
  })

  const handleDelete = async () => {
    setErrorMessage(null)
    try {
      const result = await deleteTenant({
        variables: {
          input: { tenantId },
        },
      })

      if (!result.data?.deleteAuthAdminTenant) {
        setErrorMessage(formatMessage(m.tenantHasReferences))
        toast.error(formatMessage(m.deleteTenantError))
        return
      }

      toast.success(formatMessage(m.deleteTenantSuccess))
      onDeleted()
    } catch (error) {
      setErrorMessage(formatMessage(m.tenantHasReferences))
      toast.error(formatMessage(m.deleteTenantError))
    }
  }

  return (
    <Modal
      id="delete-tenant"
      isVisible
      label={formatMessage(m.deleteTenant)}
      title={formatMessage(m.deleteTenant)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Box paddingTop={2}>
        <Text marginBottom={2}>
          {formatMessage(m.deleteTenantConfirm, {
            name: displayName ?? tenantId,
          })}
        </Text>
        {errorMessage && (
          <Box marginBottom={2}>
            <AlertMessage type="error" message={errorMessage} />
          </Box>
        )}
        <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
          <Button onClick={onClose} variant="ghost" type="button">
            {formatMessage(m.cancel)}
          </Button>
          <Button
            colorScheme="destructive"
            loading={loading}
            onClick={handleDelete}
          >
            {formatMessage(m.deleteTenant)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteTenantModal
