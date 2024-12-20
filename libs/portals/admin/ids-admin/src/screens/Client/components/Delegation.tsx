import React from 'react'
import { useLocale } from '@island.is/localization'
import { Checkbox, Hidden, Stack, Text } from '@island.is/island-ui/core'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import { AuthDelegationProvider } from '@island.is/shared/types'

import { m } from '../../../lib/messages'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { ClientFormTypes } from '../EditClient.schema'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { useDelegationProviders } from '../../../context/DelegationProviders/DelegationProvidersContext'
import { getDelegationProviderTranslations } from '../../../utils/getDelegationProviderTranslations'

interface DelegationProps {
  promptDelegations: boolean
  requireApiScopes: boolean
  supportedDelegationTypes: string[]
  selectedEnvironment: AuthAdminEnvironment
}

const FIELD_PREFIX = 'field-'

const Delegation = ({
  promptDelegations,
  requireApiScopes,
  supportedDelegationTypes,
  selectedEnvironment,
}: DelegationProps) => {
  const { formatMessage } = useLocale()
  const { client } = useClient()
  const { getDelegationProviders } = useDelegationProviders()
  const { isSuperAdmin } = useSuperAdmin()

  const delegationProviders = getDelegationProviders(selectedEnvironment)

  const [inputValues, setInputValues] = useEnvironmentState<{
    promptDelegations: boolean
    requireApiScopes: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
  }>({
    promptDelegations,
    requireApiScopes,
    supportedDelegationTypes,
    addedDelegationTypes: [],
    removedDelegationTypes: [],
  })

  const providers = delegationProviders.map(
    getDelegationProviderTranslations('clientDelegation', formatMessage),
  )

  const toggleDelegationType = (field: string, checked: boolean) => {
    const type = field.split(FIELD_PREFIX)[1]

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
      description={formatMessage(m.delegationsDescription)}
      intent={ClientFormTypes.delegations}
      accordionLabel={formatMessage(m.settings)}
      headerMarginBottom={3}
      inSync={checkEnvironmentsSync(client.environments, [
        'supportsProcuringHolders',
        'supportsLegalGuardians',
        'promptDelegations',
        'supportsPersonalRepresentatives',
        'supportsCustomDelegation',
        'requireApiScopes',
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
        <Stack space={3}>
          <Text variant="h5" as="h4">
            {formatMessage(m.additionalSettingsLabel)}
          </Text>
          <Checkbox
            label={formatMessage(m.alwaysPromptDelegations)}
            backgroundColor={'blue'}
            large
            name="promptDelegations"
            value="true"
            checked={inputValues.promptDelegations}
            onChange={() => {
              setInputValues((prev) => ({
                ...prev,
                promptDelegations: !prev.promptDelegations,
              }))
            }}
            subLabel={formatMessage(m.alwaysPromptDelegationsDescription)}
          />
          <Checkbox
            label={formatMessage(m.requirePermissions)}
            backgroundColor={'blue'}
            large
            name="requireApiScopes"
            value="true"
            checked={inputValues.requireApiScopes}
            onChange={() => {
              setInputValues((prev) => ({
                ...prev,
                requireApiScopes: !prev.requireApiScopes,
              }))
            }}
            subLabel={formatMessage(m.requirePermissionsDescription)}
          />
        </Stack>
      </Stack>
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
    </FormCard>
  )
}

export default Delegation
