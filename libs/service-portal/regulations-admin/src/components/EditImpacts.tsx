import * as s from './impacts/Impacts.css'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useDraftingState } from '../state/useDraftingState'
import { impactMsgs } from '../messages'
import { useLocale } from '@island.is/localization'
import { prettyName, RegulationType } from '@island.is/regulations'
import {
  DraftImpactName,
  DraftRegulationCancelId,
  DraftRegulationChangeId,
  RegulationDraftId,
} from '@island.is/regulations/admin'

import { useRegulationListQuery } from '../utils/dataHooks'
import { ImpactList } from './impacts/ImpactList'
import { RegDraftForm } from '../state/types'
import {
  Box,
  Button,
  Divider,
  Inline,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { EditCancellation } from './impacts/EditCancellation'
import {
  makeDraftCancellationForm,
  makeDraftChangeForm,
} from '../state/makeFields'
import { EditChange } from './impacts/EditChange'
import lastItem from 'lodash/last'

export type SelRegOption = Option & {
  value?: DraftImpactName | ''
  type: RegulationType | ''
}

const useAffectedRegulations = (
  selfType: RegulationType | '',
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
            type: reg.type,
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
          type: '',
          disabled: true,
          value: '',
          label: prettyName(name) + ' ' + notFoundText,
        }
      },
    )

    options.push({
      type: selfType,
      value: 'self',
      label: selfAffectingText,
    })

    return options
  }, [selfType, mentioned, data, notFoundText, selfAffectingText, repealedText])

  return {
    loading,
    mentionedOptions,
  }
}

// ---------------------------------------------------------------------------

export const EditImpacts = () => {
  const { draft, activeImpact, actions } = useDraftingState()
  const t = useLocale().formatMessage

  const { goToStep } = actions

  const { mentionedOptions, loading } = useAffectedRegulations(
    draft.type.value || '',
    draft.mentioned,
    t(impactMsgs.regSelect_mentionedNotFound),
    t(impactMsgs.selfAffecting),
    t(impactMsgs.regSelect_mentionedRepealed),
  )

  /*
    TODO: Fetch (when activeImpact is defined)
    The target (base) regulation and its future
    impacts (both incoming and outgoing)

    What we need to decide is how best to
    fetch and keep updated all the different impacts,
    how/where to group them by baseRegulation, etc. etc.

    DECIDE: if this should perhaps be fetched at the (root-)level
    in EditApp (in "../screens/Edit.tsx") and injected into the
    App-level state.
  */

  // const baseRegulationInfo = useBaseRegulationQuery(impactId)

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()
  const [chooseType, setChooseType] = useState<
    'cancel' | 'change' | undefined
  >()

  const closeModal = (reload?: boolean) => {
    setChooseType(undefined)
    if (reload) {
      document.location.reload()
    }
  }

  const escClick = useCallback((e) => {
    if (e.key === 'Escape') {
      setChooseType(undefined)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escClick, false)

    return () => {
      document.removeEventListener('keydown', escClick, false)
    }
  }, [escClick])

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
          {lastItem(draft.impacts[selRegOption.value])?.type === 'repeal' ? (
            <Inline align="center">
              <Text variant="h5" as="h5">
                Reglugerð er með virka brottfellingu
              </Text>
            </Inline>
          ) : (
            <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
              {selRegOption.type === 'base' && (
                <>
                  <Button
                    variant="ghost"
                    icon="document"
                    iconType="outline"
                    onClick={() => setChooseType('change')}
                    // disabled={!!draft.impacts[selRegOption.value]}
                  >
                    {t(impactMsgs.chooseType_change)}
                  </Button>
                  <span> {t(impactMsgs.chooseType_or)} </span>
                </>
              )}
              <Button
                variant="ghost"
                icon="fileTrayFull"
                iconType="outline"
                onClick={() => setChooseType('cancel')}
                // disabled={!!draft.impacts[selRegOption.value]}
              >
                {t(impactMsgs.chooseType_cancel)}
              </Button>
            </Inline>
          )}

          {chooseType === 'cancel' && (
            <EditCancellation
              draft={draft}
              cancellation={makeDraftCancellationForm({
                type: 'repeal',
                id: '' as DraftRegulationCancelId, // no ID available at this stage
                name: selRegOption.value as DraftImpactName,
                regTitle: selRegOption.label,
                date: undefined,
              })}
              closeModal={closeModal}
            />
          )}

          {chooseType === 'change' && (
            <EditChange
              draft={draft}
              change={makeDraftChangeForm({
                type: 'amend',
                id: '' as DraftRegulationChangeId, // no ID available at this stage
                name: selRegOption.value as DraftImpactName,
                regTitle: selRegOption.label,
                title: '',
                text: '',
                appendixes: [],
                comments: '',
              })}
              closeModal={closeModal}
            />
          )}
        </Box>
      )}

      <ImpactList draft={draft} impacts={draft.impacts} />
    </>
  )
}
