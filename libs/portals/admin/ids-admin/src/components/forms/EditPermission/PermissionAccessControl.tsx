import React from 'react'

import { useLocale } from '@island.is/localization'
import { Checkbox, CheckboxProps, Stack } from '@island.is/island-ui/core'

import { usePermission } from '../../Permission/PermissionContext'
import { FormCard } from '../../../shared/components/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from './EditPermission.action'
import { useEnvironmentState } from '../../../shared/hooks/useEnvironmentState'

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
  const {
    isAccessControlled,
    grantToAuthenticatedUser,
    grantToProcuringHolders,
    grantToLegalGuardians,
    allowExplicitDelegationGrant,
    grantToPersonalRepresentatives,
  } = selectedPermission

  const [inputValues, setInputValues] = useEnvironmentState({
    isAccessControlled,
    grantToAuthenticatedUser,
    grantToProcuringHolders,
    grantToLegalGuardians,
    allowExplicitDelegationGrant,
    grantToPersonalRepresentatives,
  })

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
          name="isAccessControlled"
          defaultChecked={inputValues.isAccessControlled}
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
          defaultChecked={inputValues.grantToAuthenticatedUser}
          checked={inputValues.grantToAuthenticatedUser}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToAuthenticatedUser: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToProcuringHolders)}
          subLabel={formatMessage(m.grantToProcuringHoldersDescription)}
          name="grantToProcuringHolders"
          defaultChecked={inputValues.grantToProcuringHolders}
          checked={inputValues.grantToProcuringHolders}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToProcuringHolders: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToLegalGuardians)}
          subLabel={formatMessage(m.grantToLegalGuardiansDescription)}
          name="grantToLegalGuardians"
          defaultChecked={inputValues.grantToLegalGuardians}
          checked={inputValues.grantToLegalGuardians}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToLegalGuardians: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.allowExplicitDelegationGrant)}
          subLabel={formatMessage(m.allowExplicitDelegationGrantDescription)}
          name="allowExplicitDelegationGrant"
          defaultChecked={inputValues.allowExplicitDelegationGrant}
          checked={inputValues.allowExplicitDelegationGrant}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              allowExplicitDelegationGrant: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToPersonalRepresentatives)}
          subLabel={formatMessage(m.grantToPersonalRepresentativesDescription)}
          name="grantToPersonalRepresentatives"
          defaultChecked={inputValues.grantToPersonalRepresentatives}
          checked={inputValues.grantToPersonalRepresentatives}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToPersonalRepresentatives: e.target.checked,
            })
          }}
          {...commonProps}
        />
      </Stack>
    </FormCard>
  )
}
