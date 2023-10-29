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
      title={formatMessage(m.accessControl)}
      description={formatMessage(m.accessControlDescription)}
      intent={PermissionFormTypes.ACCESS_CONTROL}
      accordionLabel={formatMessage(m.settings)}
      headerMarginBottom={3}
      inSync={checkEnvironmentsSync(permission.environments, [
        'isAccessControlled',
        'grantToAuthenticatedUser',
        'grantToProcuringHolders',
        'grantToLegalGuardians',
        'allowExplicitDelegationGrant',
        'grantToPersonalRepresentatives',
      ])}
    >
      <Stack space={2}>
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
        <Checkbox
          label={formatMessage(m.grantToProcuringHolders)}
          subLabel={formatMessage(m.grantToProcuringHoldersDescription)}
          name="grantToProcuringHolders"
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
