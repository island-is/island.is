import React from 'react'

import { useLocale } from '@island.is/localization'
import { Checkbox, Hidden, Stack, Text } from '@island.is/island-ui/core'
import { AuthDelegationProvider } from '@island.is/shared/types'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useDelegationProviders } from '../../../context/DelegationProviders/DelegationProvidersContext'
import { getDelegationProviderTranslations } from '../../../utils/getDelegationProviderTranslations'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'

const FIELD_PREFIX = 'field-'

export const PermissionDelegations = () => {
  const { formatMessage } = useLocale()
  const { selectedPermission, permission } = usePermission()
  const { isSuperAdmin } = useSuperAdmin()
  const {
    isAccessControlled,
    grantToAuthenticatedUser,
    supportedDelegationTypes,
  } = selectedPermission
  const { getDelegationProviders } = useDelegationProviders()

  const delegationProviders = getDelegationProviders(
    selectedPermission.environment,
  )

  const providers = delegationProviders.map(
    getDelegationProviderTranslations('apiScopeDelegation', formatMessage),
  )

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
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
      title={formatMessage(m.delegations)}
      intent={PermissionFormTypes.DELEGATIONS}
      inSync={checkEnvironmentsSync(permission.environments, [
        'supportedDelegationTypes',
      ])}
    >
      <Stack space={4}>
        {providers.map((provider) =>
          !provider ||
          (!isSuperAdmin &&
            (provider.id ===
              AuthDelegationProvider.PersonalRepresentativeRegistry ||
              provider.id ===
                AuthDelegationProvider.DistrictCommissionersRegistry)) ? null : (
            <Stack space={2} key={provider.id}>
              <div>
                <Text variant="h5" as="h4" paddingBottom={1}>
                  {provider.name}
                </Text>
                <Text variant="small" as="h5">
                  {provider.description}
                </Text>
              </div>
              <Stack space={3} component="ul">
                {provider.delegationTypes.map((delegationType) =>
                  !delegationType ? null : (
                    <Checkbox
                      key={delegationType.id}
                      label={delegationType.name}
                      backgroundColor={'blue'}
                      large
                      name={`${FIELD_PREFIX}${delegationType.id}`}
                      value="true"
                      checked={inputValues.supportedDelegationTypes?.includes(
                        delegationType.id,
                      )}
                      onChange={(e) =>
                        toggleDelegationType(e.target.name, e.target.checked)
                      }
                      subLabel={delegationType.description}
                    />
                  ),
                )}
              </Stack>
            </Stack>
          ),
        )}
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
