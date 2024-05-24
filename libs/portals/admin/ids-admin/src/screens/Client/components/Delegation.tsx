import { useLocale } from '@island.is/localization'
import { Checkbox, Hidden, Stack } from '@island.is/island-ui/core'

import { m } from '../../../lib/messages'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { ClientFormTypes } from '../EditClient.schema'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { AuthDelegationType } from 'delegation'
import React from 'react'

interface DelegationProps {
  promptDelegations: boolean
  supportsPersonalRepresentatives: boolean
  requireApiScopes: boolean
  supportedDelegationTypes: string[]
}

const Delegation = ({
  supportsPersonalRepresentatives,
  promptDelegations,
  requireApiScopes,
  supportedDelegationTypes,
}: DelegationProps) => {
  const { formatMessage } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const { client } = useClient()

  const [inputValues, setInputValues] = useEnvironmentState<{
    supportsPersonalRepresentatives: boolean
    promptDelegations: boolean
    requireApiScopes: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
  }>({
    supportsPersonalRepresentatives,
    promptDelegations,
    requireApiScopes,
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
      <Stack space={2}>
        <Checkbox
          label={formatMessage(m.supportCustomDelegation)}
          backgroundColor={'blue'}
          large
          name={`field-${AuthDelegationType.Custom}`}
          value="true"
          disabled={!isSuperAdmin}
          checked={inputValues.supportedDelegationTypes?.includes(
            AuthDelegationType.Custom,
          )}
          onChange={(e) =>
            toggleDelegationType(e.target.name, e.target.checked)
          }
          subLabel={formatMessage(m.supportCustomDelegationDescription)}
        />
        <Checkbox
          label={formatMessage(m.supportLegalGuardianDelegation)}
          backgroundColor={'blue'}
          large
          name={`field-${AuthDelegationType.LegalGuardian}`}
          disabled={!isSuperAdmin}
          value="true"
          checked={inputValues.supportedDelegationTypes?.includes(
            AuthDelegationType.LegalGuardian,
          )}
          onChange={(e) =>
            toggleDelegationType(e.target.name, e.target.checked)
          }
          subLabel={formatMessage(m.supportLegalGuardianDelegationDescription)}
        />
        <Checkbox
          label={formatMessage(m.supportPersonalRepresentativeDelegation)}
          backgroundColor={'blue'}
          large
          disabled={!isSuperAdmin}
          name="supportsPersonalRepresentatives"
          value="true"
          checked={inputValues.supportsPersonalRepresentatives}
          onChange={() => {
            setInputValues((prev) => ({
              ...prev,
              supportsPersonalRepresentatives:
                !prev.supportsPersonalRepresentatives,
            }))
          }}
          subLabel={formatMessage(
            m.supportPersonalRepresentativeDelegationDescription,
          )}
        />
        <Checkbox
          label={formatMessage(m.supportProcuringHolderDelegation)}
          backgroundColor={'blue'}
          large
          disabled={!isSuperAdmin}
          name={`field-${AuthDelegationType.ProcurationHolder}`}
          value="true"
          checked={inputValues.supportedDelegationTypes?.includes(
            AuthDelegationType.ProcurationHolder,
          )}
          onChange={(e) =>
            toggleDelegationType(e.target.name, e.target.checked)
          }
          subLabel={formatMessage(
            m.supportProcuringHolderDelegationDescription,
          )}
        />
        <Checkbox
          label={formatMessage(m.alwaysPromptDelegations)}
          backgroundColor={'blue'}
          large
          disabled={!isSuperAdmin}
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
          disabled={!isSuperAdmin}
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
