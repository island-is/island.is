import { AuthCustomDelegation } from '@island.is/api/schema'
import { Box, Stack } from '@island.is/island-ui/core'
import {
  AccessCard,
  DelegationViewModal,
} from '@island.is/portals/shared-modules/delegations'
import { useDeleteCustomDelegationAdminMutation } from '../screens/DelegationAdminDetails/DelegationAdmin.generated'
import { useRevalidator } from 'react-router-dom'
import React, { useState } from 'react'
import { DelegationDeleteModal } from './DelegationDeleteModal'

interface DelegationProps {
  direction: 'incoming' | 'outgoing'
  delegationsList: AuthCustomDelegation[]
}

const DelegationList = ({ delegationsList, direction }: DelegationProps) => {
  const [deleteCustomDelegationAdminMutation, { loading }] =
    useDeleteCustomDelegationAdminMutation()
  const { revalidate } = useRevalidator()
  const [delegationToDelete, setDelegationToDelete] =
    useState<AuthCustomDelegation | null>(null)
  const [delegationView, setDelegationView] =
    useState<AuthCustomDelegation | null>(null)

  const deleteHandler = async (id: string) => {
    const { data } = await deleteCustomDelegationAdminMutation({
      variables: {
        id,
      },
    })
    if (data) {
      revalidate()
      setDelegationToDelete(null)
    }
  }

  return (
    <>
      <Box marginTop={2}>
        <Stack space={3}>
          {delegationsList.map((delegation) => {
            return (
              <AccessCard
                key={delegation.id}
                delegation={delegation}
                isAdminView
                variant={direction}
                onView={
                  delegation.referenceId
                    ? (d) => setDelegationView(d)
                    : undefined
                }
                onDelete={
                  delegation.referenceId
                    ? () => setDelegationToDelete(delegation)
                    : undefined
                }
              />
            )
          })}
        </Stack>
      </Box>
      <DelegationDeleteModal
        id={`${direction}-delegation-delete-modal`}
        delegation={delegationToDelete as AuthCustomDelegation}
        loading={loading}
        onClose={() => setDelegationToDelete(null)}
        onDelete={() => {
          if (delegationToDelete) {
            deleteHandler(delegationToDelete.id as string)
          }
        }}
        isVisible={!!delegationToDelete}
      />
      <DelegationViewModal
        onClose={() => setDelegationView(null)}
        isVisible={!!delegationView}
        delegation={delegationView || undefined}
        direction={direction}
        isAdminView
      />
    </>
  )
}

export default DelegationList
