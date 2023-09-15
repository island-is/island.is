import { useState } from 'react'

import { useDraftingState } from '../../state/useDraftingState'
import { impactMsgs } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RegulationType } from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import { Option, Select } from '@island.is/island-ui/core'
import { useAffectedRegulations } from '../../utils/hooks'

export type SelRegOption = Option<DraftImpactName | ''> & {
  type: RegulationType | ''
  migrated?: boolean
}

type ImpactBaseSelectionProps = {
  setImpactRegOption: (option: SelRegOption) => void
}

// ---------------------------------------------------------------------------

export const ImpactBaseSelection = ({
  setImpactRegOption,
}: ImpactBaseSelectionProps) => {
  const { draft } = useDraftingState()
  const t = useLocale().formatMessage

  const { mentionedOptions, loading } = useAffectedRegulations(
    draft.type.value || '',
    draft.mentioned,
    t(impactMsgs.regSelect_mentionedNotFound),
    t(impactMsgs.selfAffecting),
    t(impactMsgs.regSelect_mentionedRepealed),
  )

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()

  const setOption = (option: SelRegOption) => {
    setSelRegOption(option)
    setImpactRegOption(option)
  }

  if (loading) {
    return null
  }
  return (
    <Select
      size="sm"
      label={t(impactMsgs.regSelect)}
      name="reg"
      placeholder={t(impactMsgs.regSelect_placeholder)}
      value={selRegOption}
      options={mentionedOptions}
      onChange={(option) => setOption(option as SelRegOption)}
      backgroundColor="blue"
    />
  )
}
