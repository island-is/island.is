import { getTranslatedValue } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'

import { usePermission } from '../PermissionContext'
import { EnvironmentHeader } from '../../../components/EnvironmentHeader/EnvironmentHeader'

import { Text } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { m } from '../../../lib/messages'

export const PermissionHeader = () => {
  const { locale, formatMessage } = useLocale()
  const { selectedPermission, onEnvironmentChange, permission } =
    usePermission()

  return (
    <div>
      <EnvironmentHeader
        title={getTranslatedValue(selectedPermission.displayName, locale)}
        selectedEnvironment={selectedPermission.environment}
        availableEnvironments={permission.availableEnvironments}
        onChange={onEnvironmentChange}
      />
      {selectedPermission.modified && (
        <Text variant="small">
          {formatMessage(m.modified, {
            date: format(
              new Date(selectedPermission.modified),
              'dd.MM.yyyy HH:mm',
            ),
          })}
        </Text>
      )}
    </div>
  )
}
