import { PermissionBasicInfo } from './components/PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './components/PermissionContent'
import { PermissionAccessControl } from './components/PermissionAccessControl'
import { EnvironmentProvider } from '../../context/EnvironmentContext'
import { usePermission } from './PermissionContext'
import { PublishPermission } from './PublishPermission/PublishPermission'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { PermissionDelegations } from './components/PermissionDelegations'

export const EditPermission = () => {
  const { selectedPermission, permission } = usePermission()
  const { isSuperAdmin } = useSuperAdmin()
  return (
    <EnvironmentProvider
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent />
        {isSuperAdmin && <PermissionAccessControl />}
        {isSuperAdmin && <PermissionDelegations />}
        <PublishPermission />
      </Box>
    </EnvironmentProvider>
  )
}
