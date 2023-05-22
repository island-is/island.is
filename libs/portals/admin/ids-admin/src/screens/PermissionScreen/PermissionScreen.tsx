import { Box } from '@island.is/island-ui/core'

import { EditPermission } from '../../components/forms/EditPermission/EditPermission'
import { PermissionProvider } from '../../components/Permission/PermissionContext'
import { PermissionHeader } from '../../components/Permission/PermissionHeader'
import { StickyLayout } from '../../components/StickyLayout/StickyLayout'

const PermissionScreen = () => (
  <PermissionProvider>
    <Box display="flex" flexDirection="column" rowGap={6}>
      <StickyLayout header={() => <PermissionHeader />}>
        <EditPermission />
      </StickyLayout>
    </Box>
  </PermissionProvider>
)

export default PermissionScreen
