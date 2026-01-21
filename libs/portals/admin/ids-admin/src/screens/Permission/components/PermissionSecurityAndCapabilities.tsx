import React from 'react'

import { useLocale } from '@island.is/localization'
import { Checkbox, CheckboxProps, Stack, Text } from '@island.is/island-ui/core'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'

const commonProps: Pick<CheckboxProps, 'backgroundColor' | 'large' | 'value'> =
  {
    backgroundColor: 'blue',
    large: true,
    value: 'true',
  }

export const PermissionSecurityAndCapabilities = () => {
  const { formatMessage } = useLocale()
  const { selectedPermission, permission } = usePermission()
  const { allowsWrite, requiresConfirmation } = selectedPermission

  const [inputValues, setInputValues] = useEnvironmentState<{
    allowsWrite: boolean
    requiresConfirmation: boolean
  }>({
    allowsWrite,
    requiresConfirmation,
  })

  return (
    <FormCard
      title={formatMessage(m.securityAndCapabilities)}
      intent={PermissionFormTypes.SECURITY_AND_CAPABILITIES}
      inSync={checkEnvironmentsSync(permission.environments, [
        'allowsWrite',
        'requiresConfirmation',
      ])}
    >
      <Stack space={3}>
        <Checkbox
          label={formatMessage(m.allowsWrite)}
          subLabel={formatMessage(m.allowsWriteDescription)}
          name="allowsWrite"
          checked={inputValues.allowsWrite}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              allowsWrite: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.requiresConfirmation)}
          subLabel={formatMessage(m.requiresConfirmationDescription)}
          name="requiresConfirmation"
          checked={inputValues.requiresConfirmation}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              requiresConfirmation: e.target.checked,
            })
          }}
          {...commonProps}
        />
      </Stack>
    </FormCard>
  )
}
