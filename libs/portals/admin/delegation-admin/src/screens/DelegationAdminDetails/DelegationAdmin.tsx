import { useState } from 'react'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'

import { AuthCustomDelegation } from '@island.is/api/schema'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Box, Button, GridColumn, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { maskString } from '@island.is/shared/utils'

import { DelegationDeleteModal } from '../../components/DelegationDeleteModal'
import { DelegationsResults } from '../../components/DelegationsResults'
import { fromCustomDelegation } from '../../lib/delegationView'
import { m } from '../../lib/messages'
import { DelegationAdminPaths } from '../../lib/paths'
import { useDeleteCustomDelegationAdminMutation } from './DelegationAdmin.generated'
import { DelegationAdminResult } from './DelegationAdmin.loader'

const DelegationAdminScreen = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()
  const delegationAdmin = useLoaderData() as DelegationAdminResult
  const userInfo = useUserInfo()
  const [delegationToDelete, setDelegationToDelete] =
    useState<AuthCustomDelegation | null>(null)
  const [deleteDelegation, { loading: deleting }] =
    useDeleteCustomDelegationAdminMutation()

  const canManageDelegations = userInfo?.scopes.includes(
    AdminPortalScope.delegationSystemAdmin,
  )
  const allDelegations = [
    ...delegationAdmin.outgoing,
    ...delegationAdmin.incoming,
  ] as AuthCustomDelegation[]

  const onDelete = async () => {
    if (!delegationToDelete?.id) {
      return
    }

    const { data } = await deleteDelegation({
      variables: { id: delegationToDelete.id },
    })

    if (data) {
      setDelegationToDelete(null)
      revalidate()
    }
  }

  return (
    <Stack space={4}>
      <BackButton onClick={() => navigate(DelegationAdminPaths.Root)} />

      <IntroHeader
        marginBottom={0}
        title={delegationAdmin.name}
        intro={formatNationalId(delegationAdmin.nationalId)}
      >
        {canManageDelegations && (
          <GridColumn span={['8/8', '3/8']}>
            <Box
              display={'flex'}
              justifyContent={['flexStart', 'flexEnd']}
              alignItems={['flexStart', 'center']}
              height={'full'}
            >
              <Button
                onClick={async () => {
                  const maskedNationalId =
                    (await maskString(
                      delegationAdmin.nationalId,
                      userInfo?.profile.nationalId || '',
                    )) ?? ''
                  const query = new URLSearchParams({
                    fromNationalId: maskedNationalId,
                  })
                  navigate(
                    `${
                      DelegationAdminPaths.CreateDelegation
                    }?${query.toString()}`,
                  )
                }}
                size="small"
              >
                {formatMessage(m.createNewDelegation)}
              </Button>
            </Box>
          </GridColumn>
        )}
      </IntroHeader>

      <DelegationsResults
        outgoing={delegationAdmin.outgoing.map(fromCustomDelegation)}
        incoming={delegationAdmin.incoming.map(fromCustomDelegation)}
        renderRowActions={(delegation) =>
          canManageDelegations &&
          delegation.referenceId && (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                colorScheme="destructive"
                size="small"
                onClick={() =>
                  setDelegationToDelete(
                    allDelegations.find((d) => d.id === delegation.id) ?? null,
                  )
                }
              >
                {formatMessage(m.delete)}
              </Button>
            </Box>
          )
        }
      />

      <DelegationDeleteModal
        id="delegation-delete-modal"
        delegation={delegationToDelete ?? undefined}
        loading={deleting}
        onClose={() => setDelegationToDelete(null)}
        onDelete={onDelete}
        isVisible={!!delegationToDelete}
      />
    </Stack>
  )
}

export default DelegationAdminScreen
