/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactBaseSelection.tsx
 *
 * Dropdown for selecting which regulation to impact from the list of
 * regulations mentioned in the draft text (for base/stofnreglugerð).
 *
 * Key adaptations:
 * - Removed useDraftingState() — takes mentioned regulations as props
 * - Uses Select from island-ui/core directly
 * - Simplified: no separate useAffectedRegulations hook (deferred to Phase 4 GraphQL)
 */
import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Option, Select } from '@island.is/island-ui/core'

// ---------------------------------------------------------------------------

export type SelRegOption = Option<string> & {
  type?: string
  migrated?: boolean
}

type ImpactBaseSelectionProps = {
  /** Options derived from mentioned regulation names in the draft text */
  mentionedOptions: SelRegOption[]
  /** Loading state while fetching regulation details */
  loading?: boolean
  /** Callback when a regulation is selected */
  onSelect: (option: SelRegOption) => void
}

export const ImpactBaseSelection = ({
  mentionedOptions,
  loading,
  onSelect,
}: ImpactBaseSelectionProps) => {
  const { formatMessage: f } = useLocale()

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()

  const setOption = (option: SelRegOption) => {
    setSelRegOption(option)
    onSelect(option)
  }

  if (loading) {
    return null
  }
  if (!mentionedOptions.length) {
    return null
  }

  return (
    <Select
      size="sm"
      label="Reglugerð sem breytist"
      name="reg"
      placeholder="Veldu reglugerð"
      value={selRegOption}
      options={mentionedOptions}
      onChange={(option) => setOption(option as SelRegOption)}
      backgroundColor="blue"
    />
  )
}
