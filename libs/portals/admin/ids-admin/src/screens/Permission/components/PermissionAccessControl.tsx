import React from 'react'

import { useLocale } from '@island.is/localization'
import { Checkbox, CheckboxProps, Stack } from '@island.is/island-ui/core'

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

export const PermissionAccessControl = () => {
  const { formatMessage } = useLocale()
  const { selectedPermission, permission } = usePermission()
  const { isAccessControlled, grantToAuthenticatedUser } = selectedPermission

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
  })

  return (
    <FormCard
      title={formatMessage(m.accessControl)}
      intent={PermissionFormTypes.ACCESS_CONTROL}
      inSync={checkEnvironmentsSync(permission.environments, [
        'isAccessControlled',
        'grantToAuthenticatedUser',
      ])}
    >
      <Stack space={3}>
        <Checkbox
          label={formatMessage(m.isAccessControlled)}
          subLabel={formatMessage(m.isAccessControlledDescription)}
          name="isAccessControlled"
          checked={inputValues.isAccessControlled}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              isAccessControlled: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToAuthenticatedUser)}
          subLabel={formatMessage(m.grantToAuthenticatedUserDescription)}
          name="grantToAuthenticatedUser"
          checked={inputValues.grantToAuthenticatedUser}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToAuthenticatedUser: e.target.checked,
            })
          }}
          {...commonProps}
        />
      </Stack>
    </FormCard>
  )
}
