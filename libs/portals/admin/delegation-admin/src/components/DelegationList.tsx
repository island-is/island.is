import { AuthCustomDelegation } from '@island.is/api/schema'
import { Box, Stack } from '@island.is/island-ui/core'
import { AccessCard } from '@island.is/portals/shared-modules/delegations'

interface DelegationProps {
  direction: 'incoming' | 'outgoing'
  delegationsList: AuthCustomDelegation[]
}

const DelegationList = ({ delegationsList, direction }: DelegationProps) => {
  return (
    <Box marginTop={2}>
      <Stack space={3}>
        {delegationsList.map((delegation) => (
          <AccessCard
            canModify={false}
            direction={direction}
            key={delegation.id}
            delegation={delegation}
            onDelete={() => {
              console.warn('Delete delegation')
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default DelegationList
