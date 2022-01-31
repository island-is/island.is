import * as s from './CreateImpacts.css'

import React, { useMemo, useState } from 'react'
import { useDraftingState } from '../../state/useDraftingState'
import { impactMsgs } from '../../messages'
import { useLocale } from '../../utils'
import { prettyName } from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import { useRegulationListQuery } from '../../utils/dataHooks'
import { ImpactList } from '../impacts/ImpactList'
import { RegDraftForm } from '../../state/types'
import {
  Box,
  Button,
  Divider,
  Inline,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'

type SelRegOption = Option & { value?: DraftImpactName | '' }

const useAffectedRegulations = (
  mentioned: RegDraftForm['mentioned'],
  notFoundText: string,
  selfAffectingText: string,
  repealedText: string,
) => {
  const { data, loading /* , error */ } = useRegulationListQuery(mentioned)

  const mentionedOptions = useMemo(() => {
    if (!data) {
      return []
    }
    const options = mentioned.map(
      (name): SelRegOption => {
        const reg = data.find((r) => r.name === name)
        if (reg) {
          return {
            disabled: !!reg.repealed,
            value: name,
            label:
              prettyName(name) +
              ' – ' +
              reg.title +
              (reg.repealed ? ` (${repealedText})` : ''),
          }
        }
        return {
          disabled: true,
          value: '',
          label: prettyName(name) + ' ' + notFoundText,
        }
      },
    )

    options.push({
      value: 'self',
      label: selfAffectingText,
    })

    return options
  }, [mentioned, data, notFoundText, selfAffectingText, repealedText])

  return {
    loading,
    mentionedOptions,
  }
}

// ---------------------------------------------------------------------------

export const CreateImpact = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()

  const { goToStep } = actions

  const { mentionedOptions, loading } = useAffectedRegulations(
    draft.mentioned,
    t(impactMsgs.regSelect_mentionedNotFound),
    t(impactMsgs.selfAffecting),
    t(impactMsgs.regSelect_mentionedRepealed),
  )

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()

  if (loading) {
    return null
  }

  return (
    <>
      <Box marginBottom={3} className={s.explainerText}>
        {t(impactMsgs.regExplainer)}
        {'    '}
        <Button onClick={() => goToStep('basics')} variant="text" size="small">
          {t(impactMsgs.regExplainer_editLink)}
        </Button>
      </Box>

      <Box marginBottom={4}>
        <Select
          size="sm"
          label={t(impactMsgs.regSelect)}
          name="reg"
          placeholder={t(impactMsgs.regSelect_placeholder)}
          value={selRegOption}
          options={mentionedOptions}
          onChange={(option) => setSelRegOption(option as SelRegOption)}
          backgroundColor="blue"
        />
      </Box>

      {selRegOption && (
        <Box marginBottom={[4, 4, 8]}>
          <Box marginBottom={2}>
            <Divider weight="regular" />
            {' '}
          </Box>
          <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
            {t(impactMsgs.chooseType)}
          </Text>
          <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
            <Button variant="ghost" icon="document" iconType="outline">
              {t(impactMsgs.chooseType_change)}
            </Button>
            <span> {t(impactMsgs.chooseType_or)} </span>
            <Button variant="ghost" icon="fileTrayFull" iconType="outline">
              {t(impactMsgs.chooseType_cancel)}
            </Button>
          </Inline>
        </Box>
      )}

      <ImpactList impacts={draft.impacts} />
    </>
  )
}
