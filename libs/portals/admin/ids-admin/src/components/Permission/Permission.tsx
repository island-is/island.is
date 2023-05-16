import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Box } from '@island.is/island-ui/core'

import { getTranslatedValue } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'

import { PermissionLoaderResult } from './Permission.loader'
import { EnvironmentHeader } from '../forms/EnvironmentHeader/EnvironmentHeader'

function Permission() {
  const { locale } = useLocale()
  const permissionResult = useLoaderData() as PermissionLoaderResult
  const [selectedPermission, setSelectedPermission] = useState(
    permissionResult.environments.find(
      ({ environment }) =>
        environment === permissionResult.defaultEnvironment.name,
    ) ?? permissionResult.environments[0],
  )

  return (
    <Box>
      <EnvironmentHeader
        title={getTranslatedValue(selectedPermission.displayName, locale)}
        selectedEnvironment={selectedPermission.environment}
        onChange={(env) => console.log('onChange', env)}
      />
    </Box>
  )
}

export default Permission
