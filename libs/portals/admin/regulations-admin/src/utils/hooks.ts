import { Regulation, RegulationType, toISODate } from '@island.is/regulations'
import {
  DraftImpact,
  RegulationDraftId,
  RegulationHistoryItemAdmin,
} from '@island.is/regulations/admin'
import { useEffect, useMemo, useState } from 'react'
import { DraftImpactForm, RegDraftForm } from '../state/types'
import { Effects } from '../types'
import sortBy from 'lodash/sortBy'
import { useRegulationListQuery } from './dataHooks'
import { formatSelRegOptions } from './formatSelRegOptions'

export const useIsBrowserSide = () => {
  const [isBrowser, setIsBrowser] = useState<true | undefined>(undefined)
  useEffect(() => {
    setIsBrowser(true)
  }, [])
  return isBrowser
}

export const useGetRegulationHistory = (
  regulation?: Regulation,
  activeImpact?: DraftImpactForm,
  draftImpacts?: DraftImpact[],
  draftId?: RegulationDraftId,
) => {
  const today = useMemo(() => toISODate(new Date()), [])

  const { effects } = useMemo(() => {
    const effects = regulation?.history.reduce<Effects>(
      (obj, item) => {
        const arr = item.date > today ? obj.future : obj.past
        arr.push(item)
        return obj
      },
      { past: [], future: [] },
    )

    return {
      effects,
    }
  }, [regulation, today])

  const allFutureEffects = useMemo(() => {
    if (!activeImpact) return []

    const futureEffects: RegulationHistoryItemAdmin[] =
      effects?.future.map((f) => ({ ...f, origin: 'api', id: 'api' })) ?? []

    const draftImpactsArray: RegulationHistoryItemAdmin[] =
      draftImpacts?.map((i) => ({
        id: i.id,
        changingId: i.changingId,
        date: i.date,
        name: i.name,
        title: i.regTitle,
        effect: i.type,
        origin: i.id === activeImpact.id ? 'self' : 'admin',
      })) ?? []

    const futureEffectArray = [...futureEffects, ...draftImpactsArray]

    return sortBy(futureEffectArray, (o) => o.date)
  }, [activeImpact, draftImpacts, effects?.future])

  const hasImpactMismatch = !!draftImpacts?.filter(
    (draftImpact) => draftImpact.changingId !== draftId,
  ).length

  return { allFutureEffects, hasImpactMismatch }
}

export const useAffectedRegulations = (
  selfType: RegulationType | '',
  mentioned: RegDraftForm['mentioned'],
  notFoundText: string,
  selfAffectingText: string,
  repealedText: string,
) => {
  const { data, loading, error } = useRegulationListQuery(mentioned)

  const mentionedOptions = useMemo(() => {
    if (!data || error) {
      return []
    }
    const options = formatSelRegOptions(
      mentioned,
      notFoundText,
      repealedText,
      data,
    )

    // options.push({
    //   type: selfType,
    //   value: 'self',
    //   label: selfAffectingText,
    // })

    return options
  }, [selfType, mentioned, data, notFoundText, selfAffectingText, repealedText])

  return {
    loading,
    mentionedOptions,
  }
}

export const usePristineRegulations = () => {
  const [pristineRegulations, setPristineRegulations] = useState(() => {
    const storedRegulations = sessionStorage.getItem('PRISTINE_REGULATIONS')
    return storedRegulations ? JSON.parse(storedRegulations) : []
  })

  const addPristineRegulation = (regId: string) => {
    if (!pristineRegulations.includes(regId)) {
      const updatedRegulations = [...pristineRegulations, regId]
      setPristineRegulations(updatedRegulations)
      sessionStorage.setItem(
        'PRISTINE_REGULATIONS',
        JSON.stringify(updatedRegulations),
      )
    }
  }

  const removePristineRegulation = (regId: string) => {
    const updatedRegulations = pristineRegulations.filter(
      (id: string) => id !== regId,
    )
    setPristineRegulations(updatedRegulations)
    sessionStorage.setItem(
      'PRISTINE_REGULATIONS',
      JSON.stringify(updatedRegulations),
    )
  }

  const isPristineRegulation = (regId: string) =>
    pristineRegulations.includes(regId)

  return {
    addPristineRegulation,
    removePristineRegulation,
    isPristineRegulation,
  }
}
