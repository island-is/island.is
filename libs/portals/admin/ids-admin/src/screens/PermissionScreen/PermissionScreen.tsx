import { Box } from '@island.is/island-ui/core'

import { EditPermission } from '../../components/forms/EditPermission/EditPermission'
import { PermissionProvider } from '../../components/Permission/PermissionContext'
import { PermissionHeader } from '../../components/Permission/PermissionHeader'

const Permission = () => (
  <PermissionProvider>
    <Box display="flex" flexDirection="column" rowGap={6}>
      <PermissionHeader />
      <EditPermission />
    </Box>
  </PermissionProvider>
)

export default Permission
