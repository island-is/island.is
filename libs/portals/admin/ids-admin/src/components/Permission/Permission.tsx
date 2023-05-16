import { PermissionProvider } from './PermissionContext'
import { PermissionHeader } from './PermissionHeader'
import { PermissionForm } from './PermissionForm/PermissionForm'
import { Box } from '@island.is/island-ui/core'

function Permission() {
  return (
    <PermissionProvider>
      <Box display="flex" flexDirection="column" rowGap={6}>
        <PermissionHeader />
        <PermissionForm />
      </Box>
    </PermissionProvider>
  )
}

export default Permission
