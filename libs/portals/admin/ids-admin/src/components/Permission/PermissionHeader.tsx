import { getTranslatedValue } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'

import { usePermission } from './PermissionContext'
import { EnvironmentHeader } from '../forms/EnvironmentHeader/EnvironmentHeader'

export const PermissionHeader = () => {
  const { locale } = useLocale()
  const {
    selectedPermission,
    onEnvironmentChange,
    permission,
  } = usePermission()

  return (
    <EnvironmentHeader
      title={getTranslatedValue(selectedPermission.displayName, locale)}
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
      onChange={onEnvironmentChange}
      allowPublishing={false}
    />
  )
}
