import { getTranslatedValue } from '@island.is/portals/core'
import { EnvironmentHeader } from '../forms/EnvironmentHeader/EnvironmentHeader'
import { usePermission } from './PermissionContext'
import { useLocale } from '@island.is/localization'

export const PermissionHeader = () => {
  const { locale } = useLocale()
  const { selectedPermission, onEnvironmentChange } = usePermission()

  return (
    <EnvironmentHeader
      title={getTranslatedValue(selectedPermission.displayName, locale)}
      selectedEnvironment={selectedPermission.environment}
      onChange={onEnvironmentChange}
    />
  )
}
