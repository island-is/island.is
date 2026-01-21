import { PermissionBasicInfo } from './components/PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './components/PermissionContent'
import { PermissionAccessControl } from './components/PermissionAccessControl'
import { EnvironmentProvider } from '../../context/EnvironmentContext'
import { usePermission } from './PermissionContext'
import { PublishPermission } from './PublishPermission/PublishPermission'
import { PermissionDelegations } from './components/PermissionDelegations'
import { PermissionCategoriesAndTags } from './components/PermissionCategoriesAndTags'

export const EditPermission = () => {
  const { selectedPermission, permission } = usePermission()

  return (
    <EnvironmentProvider
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent />
        <PermissionCategoriesAndTags />
        <PermissionDelegations />
        <PermissionAccessControl />
        <PublishPermission />
      </Box>
    </EnvironmentProvider>
  )
}
