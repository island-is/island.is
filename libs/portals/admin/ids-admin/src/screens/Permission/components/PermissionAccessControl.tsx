import React from 'react'

import { useLocale } from '@island.is/localization'
import {
  Checkbox,
  CheckboxProps,
  Hidden,
  Stack,
} from '@island.is/island-ui/core'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { AuthDelegationType } from 'delegation'

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
    grantToPersonalRepresentatives,
    supportedDelegationTypes,
  } = selectedPermission

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
    grantToPersonalRepresentatives: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
    grantToPersonalRepresentatives,
    supportedDelegationTypes,
    addedDelegationTypes: [],
    removedDelegationTypes: [],
  })

  const toggleDelegationType = (field: string, checked: boolean) => {
    const type = field.split('-')[1]

    if (checked) {
      const newInputValues = { ...inputValues }
      // should not be in removed delegation types if field is checked
      if (inputValues.removedDelegationTypes.includes(type)) {
        newInputValues.removedDelegationTypes =
          inputValues.removedDelegationTypes.filter((t) => t !== type)
      }

      // if not in supported delegation types, user is adding it for the first time
      if (!supportedDelegationTypes.includes(type)) {
        newInputValues.addedDelegationTypes = [
          ...inputValues.addedDelegationTypes,
          type,
        ]
        newInputValues.supportedDelegationTypes = [
          ...inputValues.supportedDelegationTypes,
          type,
        ]
      }

      // if already in supported delegation types, user is re-adding it
      if (supportedDelegationTypes.includes(type)) {
        newInputValues.supportedDelegationTypes = [
          ...inputValues.supportedDelegationTypes,
          type,
        ]
      }

      setInputValues(newInputValues)
    } else {
      const newInputValues = { ...inputValues }
      // should not be in added delegation types if field is not checked
      if (inputValues.addedDelegationTypes.includes(type)) {
        newInputValues.addedDelegationTypes =
          inputValues.addedDelegationTypes.filter((t) => t !== type)
      }
      // should not be in supported delegation types if field is not checked
      if (inputValues.supportedDelegationTypes.includes(type)) {
        newInputValues.supportedDelegationTypes =
          inputValues.supportedDelegationTypes.filter((t) => t !== type)
      }

      // if not in removed delegation types, user is removing it for the first time
      if (supportedDelegationTypes.includes(type)) {
        newInputValues.removedDelegationTypes = [
          ...inputValues.removedDelegationTypes,
          type,
        ]
      }

      setInputValues(newInputValues)
    }
  }

  return (
    <FormCard
      title={formatMessage(m.accessControl)}
      intent={PermissionFormTypes.ACCESS_CONTROL}
      inSync={checkEnvironmentsSync(permission.environments, [
        'isAccessControlled',
        'grantToAuthenticatedUser',
        'grantToPersonalRepresentatives',
        'supportedDelegationTypes',
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
          name={`field-${AuthDelegationType.ProcurationHolder}`}
          checked={inputValues.supportedDelegationTypes.includes(
            AuthDelegationType.ProcurationHolder,
          )}
          onChange={(e) => {
            toggleDelegationType(e.target.name, e.target.checked)
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToLegalGuardians)}
          subLabel={formatMessage(m.grantToLegalGuardiansDescription)}
          name={`field-${AuthDelegationType.LegalGuardian}`}
          checked={inputValues.supportedDelegationTypes.includes(
            AuthDelegationType.LegalGuardian,
          )}
          onChange={(e) => {
            toggleDelegationType(e.target.name, e.target.checked)
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.allowExplicitDelegationGrant)}
          subLabel={formatMessage(m.allowExplicitDelegationGrantDescription)}
          name={`field-${AuthDelegationType.Custom}`}
          checked={inputValues.supportedDelegationTypes.includes(
            AuthDelegationType.Custom,
          )}
          onChange={(e) => {
            toggleDelegationType(e.target.name, e.target.checked)
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.grantToPersonalRepresentatives)}
          subLabel={formatMessage(m.grantToPersonalRepresentativesDescription)}
          name="grantToPersonalRepresentatives"
          checked={inputValues.supportedDelegationTypes.some((type) =>
            type.startsWith(AuthDelegationType.PersonalRepresentative),
          )}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToPersonalRepresentatives: e.target.checked,
            })
          }}
          {...commonProps}
        />
        {inputValues.removedDelegationTypes.map((type) => (
          <Hidden key={type} print screen>
            <input type="hidden" name="removedDelegationTypes" value={type} />
          </Hidden>
        ))}
        {inputValues.addedDelegationTypes.map((type) => (
          <Hidden key={type} print screen>
            <input type="hidden" name="addedDelegationTypes" value={type} />
          </Hidden>
        ))}
      </Stack>
    </FormCard>
  )
}
