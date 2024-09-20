import { AuthCustomDelegation } from '@island.is/api/schema'
import { Box, Stack } from '@island.is/island-ui/core'
import { AccessCard } from '@island.is/portals/shared-modules/delegations'
import { useDeleteCustomDelegationAdminMutation } from '../screens/DelegationAdminDetails/DelegationAdmin.generated'
import { useRevalidator } from 'react-router-dom'

interface DelegationProps {
  direction: 'incoming' | 'outgoing'
  delegationsList: AuthCustomDelegation[]
}

const DelegationList = ({ delegationsList, direction }: DelegationProps) => {
  const [deleteCustomDelegationAdminMutation] =
    useDeleteCustomDelegationAdminMutation()
  const { revalidate } = useRevalidator()

  return (
    <Box marginTop={2}>
      <Stack space={3}>
        {delegationsList.map((delegation) => (
          <AccessCard
            canModify={direction === 'outgoing' && !!delegation.referenceId} // only allow deletion of paper delegations
            direction={direction}
            key={delegation.id}
            delegation={delegation}
            onDelete={async () => {
              const { data } = await deleteCustomDelegationAdminMutation({
                variables: {
                  id: delegation.id as string,
                },
              })
              if (data) {
                revalidate()
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default DelegationList
