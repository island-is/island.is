import React from 'react'

import { useLocale } from '@island.is/localization'
import { Checkbox, CheckboxProps, Stack } from '@island.is/island-ui/core'

import { usePermission } from '../../Permission/PermissionContext'
import { FormCard } from '../../../shared/components/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from './EditPermission.action'

const commonProps: Pick<
  CheckboxProps,
  'backgroundColor' | 'large' | 'value'
> = {
  backgroundColor: 'blue',
  large: true,
  value: 'true',
}

export const PermissionAccessControl = () => {
  const { formatMessage } = useLocale()
  const { selectedPermission, permission } = usePermission()

  return (
    <FormCard
      title={formatMessage(m.basicInfo)}
      intent={PermissionFormTypes.ACCESS_CONTROL}
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Stack space={2}>
        <Checkbox
          label={formatMessage(m.isAccessControlled)}
          subLabel={formatMessage(m.isAccessControlledDescription)}
          defaultChecked={selectedPermission.isAccessControlled}
          name="isAccessControlled"
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToAuthenticatedUser)}
          subLabel={formatMessage(m.grantToAuthenticatedUserDescription)}
          defaultChecked={selectedPermission.grantToAuthenticatedUser}
          name="grantToAuthenticatedUser"
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToProcuringHolders)}
          subLabel={formatMessage(m.grantToProcuringHoldersDescription)}
          defaultChecked={selectedPermission.grantToProcuringHolders}
          name="grantToProcuringHolders"
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToLegalGuardians)}
          subLabel={formatMessage(m.grantToLegalGuardiansDescription)}
          defaultChecked={selectedPermission.grantToLegalGuardians}
          name="grantToLegalGuardians"
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.allowExplicitDelegationGrant)}
          subLabel={formatMessage(m.allowExplicitDelegationGrantDescription)}
          defaultChecked={selectedPermission.allowExplicitDelegationGrant}
          name="allowExplicitDelegationGrant"
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToPersonalRepresentatives)}
          subLabel={formatMessage(m.grantToPersonalRepresentativesDescription)}
          defaultChecked={selectedPermission.grantToPersonalRepresentatives}
          name="grantToPersonalRepresentatives"
          {...commonProps}
        />
      </Stack>
    </FormCard>
  )
}
