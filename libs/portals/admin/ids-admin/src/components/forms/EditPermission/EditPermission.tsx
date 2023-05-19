import { PermissionBasicInfo } from './PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './PermissionContent'
import { PermissionAccessControl } from './PermissionAccessControl'
import { usePermission } from '../../Permission/PermissionContext'

export const EditPermission = () => {
  const {
    selectedPermission,
    permission,
    intent: intentState,
  } = usePermission()
  return (
    <Box display="flex" flexDirection="column" rowGap={5}>
      <PermissionBasicInfo />
      <PermissionContent />
      <PermissionAccessControl />
    </Box>
  )
}
