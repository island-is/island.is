import { PermissionBasicInfo } from './PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './PermissionContent'
import { PermissionAccessControl } from './PermissionAccessControl'
import { EnvironmentProvider } from '../../../shared/context/EnvironmentContext'
import { usePermission } from '../../Permission/PermissionContext'

export const EditPermission = () => {
  const { selectedPermission } = usePermission()

  return (
    <EnvironmentProvider selectedEnvironment={selectedPermission.environment}>
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent />
        <PermissionAccessControl />
      </Box>
    </EnvironmentProvider>
  )
}
