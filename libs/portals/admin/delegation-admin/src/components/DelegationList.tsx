import { AuthCustomDelegation } from '@island.is/api/schema'
import { Box, Stack } from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/auth/react'
import { AccessCard } from '@island.is/portals/shared-modules/delegations'

interface DelegationProps {
  direction: 'incoming' | 'outgoing'
  delegationsList: AuthCustomDelegation[]
}

const DelegationList = ({ delegationsList, direction }: DelegationProps) => {
  const userInfo = useUserInfo()

  return (
    <Box marginTop={2}>
      <Stack space={3}>
        {delegationsList.map((delegation) => (
          <AccessCard
            canModify={userInfo.scopes.includes(
              '@admin.island.is/delegation-system:admin',
            )}
            direction={direction}
            key={delegation.id}
            delegation={delegation}
            onDelete={() => {
              console.log('deleteing')
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default DelegationList
