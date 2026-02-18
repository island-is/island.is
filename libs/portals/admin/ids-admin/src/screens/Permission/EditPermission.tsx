import { PermissionBasicInfo } from './components/PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './components/PermissionContent'
import { PermissionSecurityAndCapabilities } from './components/PermissionSecurityAndCapabilities'
import { PermissionAccessControl } from './components/PermissionAccessControl'
import { EnvironmentProvider } from '../../context/EnvironmentContext'
import { usePermission } from './PermissionContext'
import { PublishPermission } from './PublishPermission/PublishPermission'
import { PermissionDelegations } from './components/PermissionDelegations'
import {
  FeatureFlagClient,
  Features,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'

export const EditPermission = () => {
  const { selectedPermission, permission } = usePermission()

  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [isNewPermissionsOptionsEnabled, setNewPermissionsOptionsEnabled] =
    useState(false)

  useEffect(() => {
    const checkNewPermissionsOptionsEnabled = async () => {
      const newPermissionsOptionsEnabled = await featureFlagClient.getValue(
        Features.isNewPermissionsOptionsEnabled,
        false,
      )
      setNewPermissionsOptionsEnabled(newPermissionsOptionsEnabled)
    }

    checkNewPermissionsOptionsEnabled()
  }, [featureFlagClient])

  return (
    <EnvironmentProvider
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent
          isNewPermissionsOptionsEnabled={isNewPermissionsOptionsEnabled}
        />
        {isNewPermissionsOptionsEnabled && (
          <PermissionSecurityAndCapabilities />
        )}
        <PermissionDelegations />
        <PermissionAccessControl />
        <PublishPermission />
      </Box>
    </EnvironmentProvider>
  )
}
