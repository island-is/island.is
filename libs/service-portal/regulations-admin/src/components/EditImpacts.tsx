import * as s from './EditImpacts.css'

import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  DatePicker,
  Divider,
  Inline,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '../utils'
import { prettyName } from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import { MessageDescriptor } from '@formatjs/intl'
import { useRegulationListQuery } from '../utils/dataHooks'
import { ImpactList } from './ImpactList'
import { RegDraftForm } from '../state/types'

// ---------------------------------------------------------------------------

const today = new Date()

// ---------------------------------------------------------------------------

type SelRegOption = Option & { value?: DraftImpactName | '' }

const useAffectedRegulations = (
  mentioned: RegDraftForm['mentioned'],
  notFoundText: string,
  selfAffectingText: string,
) => {
  const { data, loading } = useRegulationListQuery(mentioned)

  const mentionedOptions = useMemo(() => {
    if (!data) {
      return []
    }
    const options = mentioned.map(
      (name): SelRegOption => {
        const reg = data.find((r) => r.name === name)
        if (reg) {
          return {
            value: name,
            label: prettyName(name) + ' – ' + reg.title,
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
  }, [mentioned, data, loading, notFoundText, selfAffectingText])

  return {
    loading,
    mentionedOptions,
  }
}

// ---------------------------------------------------------------------------

export const EditImpacts: StepComponent = (props) => {
  const { draft, actions } = props
  const t = useLocale().formatMessage

  const { goToStep } = actions

  const { mentionedOptions, loading } = useAffectedRegulations(
    draft.mentioned,
    t(msg.impactRegSelect_mentionedNotFound),
    t(msg.impactSelfAffecting),
  )

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()

  const minDate = draft.idealPublishDate.value || today
  const [effectiveDate, setEffectiveDate] = useState<{
    value?: Date | undefined
    error?: string | MessageDescriptor
  }>({})

  const handleSetEffectiveDate = useCallback(
    (value: Date | undefined) => {
      if (value && value < minDate) {
        setEffectiveDate({ value, error: msg.impactEffectiveDate_toosoon })
        return
      }
      setEffectiveDate({ value, error: undefined })
    },
    [minDate],
  )

  if (loading) {
    return null
  }

  return (
    <>
      <Box marginBottom={3} className={s.explainerText}>
        {t(msg.impactRegExplainer)}
        {'    '}
        <Button onClick={() => goToStep('basics')} variant="text" size="small">
          {t(msg.impactRegExplainer_editLink)}
        </Button>
      </Box>

      <Box marginBottom={4}>
        <Select
          size="sm"
          label={t(msg.impactRegSelect)}
          name="reg"
          placeholder={t(msg.impactRegSelect_placeholder)}
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
            {t(msg.chooseImpactType)}
          </Text>
          <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
            <Button variant="ghost" icon="document" iconType="outline">
              {t(msg.chooseImpactType_change)}
            </Button>
            <span> {t(msg.chooseImpactType_or)} </span>
            <Button variant="ghost" icon="fileTrayFull" iconType="outline">
              {t(msg.chooseImpactType_cancel)}
            </Button>
          </Inline>
        </Box>
      )}

      {/* {selRegOption && (
        <Box marginBottom={4} width="half">
          <DatePicker
            size="sm"
            label={t(msg.impactEffectiveDate)}
            placeholderText={t(msg.impactEffectiveDate_default)}
            minDate={minDate}
            selected={effectiveDate.value}
            handleChange={handleSetEffectiveDate}
            hasError={!!effectiveDate.error}
            errorMessage={t(effectiveDate.error)}
            backgroundColor="blue"
          />
          {!!draft.effectiveDate.value && (
            <Button
              size="small"
              variant="text"
              preTextIcon="close"
              onClick={() => handleSetEffectiveDate(undefined)}
            >
              {t(msg.effectiveDate_default)}
            </Button>
          )}
        </Box>
      )} */}

      <ImpactList impacts={draft.impacts} />
    </>
  )
}
