import { AuthCustomDelegation } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { AccessItemHeader } from './AccessItemHeader'

interface AccessListProps {
  delegation: AuthCustomDelegation
}

export const AccessList = ({ delegation }: AccessListProps) => {
  return (
    <Box>
      <AccessItemHeader />
      <Box>list</Box>
    </Box>
  )
}
