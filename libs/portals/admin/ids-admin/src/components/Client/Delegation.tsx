import { useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import { useLocale } from '@island.is/localization'
import { Checkbox, Stack } from '@island.is/island-ui/core'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'

interface DelegationProps {
  supportsProcuringHolders: boolean
  supportsLegalGuardians: boolean
  promptDelegations: boolean
  supportsPersonalRepresentatives: boolean
  supportsCustomDelegation: boolean
  requireApiScopes: boolean
}

const Delegation = ({
  supportsCustomDelegation,
  supportsLegalGuardians,
  supportsPersonalRepresentatives,
  supportsProcuringHolders,
  promptDelegations,
  requireApiScopes,
}: DelegationProps) => {
  const { formatMessage } = useLocale()
  const [procuring, setProcuring] = useState(supportsProcuringHolders)
  const [legalGuardian, setLegalGuardian] = useState(supportsLegalGuardians)
  const [prompt, setPrompt] = useState(promptDelegations)
  const [apiScope, setApiScope] = useState(requireApiScopes)
  const [personalRepresentative, setPersonalRepresentative] = useState(
    supportsPersonalRepresentatives,
  )
  const [customDelegation, setCustomDelegation] = useState(
    supportsCustomDelegation,
  )
  return (
    <ContentCard
      title={formatMessage(m.delegations)}
      description={formatMessage(m.delegationsDescription)}
      isDirty={() => true}
      onSave={() => Promise.resolve()}
      intent={ClientFormTypes.delegations}
    >
      <Stack space={2}>
        <Checkbox
          label={formatMessage(m.supportCustomDelegation)}
          backgroundColor={'blue'}
          large
          name="supportsCustomDelegation"
          value={`${customDelegation}`}
          subLabel={formatMessage(m.supportCustomDelegationDescription)}
          checked={customDelegation}
          onChange={() => setCustomDelegation(!customDelegation)}
        />
        <Checkbox
          label={formatMessage(m.supportLegalGuardianDelegation)}
          backgroundColor={'blue'}
          large
          name="supportsLegalGuardians"
          value={`${legalGuardian}`}
          subLabel={formatMessage(m.supportLegalGuardianDelegationDescription)}
          checked={legalGuardian}
          onChange={() => setLegalGuardian(!legalGuardian)}
        />
        <Checkbox
          label={formatMessage(m.supportPersonalRepresentativeDelegation)}
          backgroundColor={'blue'}
          large
          name="supportsPersonalRepresentatives"
          value={`${personalRepresentative}`}
          subLabel={formatMessage(
            m.supportPersonalRepresentativeDelegationDescription,
          )}
          checked={personalRepresentative}
          onChange={() => setPersonalRepresentative(!personalRepresentative)}
        />
        <Checkbox
          label={formatMessage(m.supportProcuringHolderDelegation)}
          backgroundColor={'blue'}
          large
          name="supportsProcuringHolders"
          value={`${procuring}`}
          subLabel={formatMessage(
            m.supportProcuringHolderDelegationDescription,
          )}
          checked={procuring}
          onChange={() => setProcuring(!procuring)}
        />
        <Checkbox
          label={formatMessage(m.alwaysPromptDelegations)}
          backgroundColor={'blue'}
          large
          name="promptDelegations"
          value={`${prompt}`}
          subLabel={formatMessage(m.alwaysPromptDelegationsDescription)}
          checked={prompt}
          onChange={() => setPrompt(!prompt)}
        />
        <Checkbox
          label={formatMessage(m.requirePermissions)}
          backgroundColor={'blue'}
          large
          name="requireApiScopes"
          value={`${apiScope}`}
          subLabel={formatMessage(m.requirePermissionsDescription)}
          checked={apiScope}
          onChange={() => setApiScope(!apiScope)}
        />
      </Stack>
    </ContentCard>
  )
}

export default Delegation
