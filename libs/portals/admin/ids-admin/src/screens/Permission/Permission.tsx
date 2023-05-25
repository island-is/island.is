import { Box } from '@island.is/island-ui/core'

import { EditPermission } from './EditPermission'
import { PermissionProvider } from './PermissionContext'
import { PermissionHeader } from './components/PermissionHeader'
import { StickyLayout } from '../../components/StickyLayout/StickyLayout'

const Permission = () => (
  <PermissionProvider>
    <Box display="flex" flexDirection="column" rowGap={6}>
      <StickyLayout header={() => <PermissionHeader />}>
        <EditPermission />
      </StickyLayout>
    </Box>
  </PermissionProvider>
)

export default Permission
