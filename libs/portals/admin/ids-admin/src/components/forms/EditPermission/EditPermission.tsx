import { PermissionBasicInfo } from './PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './PermissionContent'
import { PermissionAccessControl } from './PermissionAccessControl'

export const EditPermission = () => (
  <Box display="flex" flexDirection="column" rowGap={5}>
    <PermissionBasicInfo />
    <PermissionContent />
    <PermissionAccessControl />
  </Box>
)
