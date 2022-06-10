import { RegName, Regulation, toISODate } from '@island.is/regulations'
import {
  DraftImpact,
  RegulationDraftId,
  RegulationHistoryItemAdmin,
} from '@island.is/regulations/admin'
import { useEffect, useMemo, useState } from 'react'
import { DraftImpactForm } from '../state/types'
import { Effects } from '../types'
import sortBy from 'lodash/sortBy'

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
  const targetName = activeImpact?.name as RegName
  const activeImpactDate = activeImpact?.date?.value
  const today = useMemo(() => toISODate(new Date()), [])

  const { effects } = useMemo(() => {
    const effects = regulation?.history.reduce<Effects>(
      (obj, item, i) => {
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

    if (!draftImpactsArray.find((i) => i.id === activeImpact.id)) {
      futureEffectArray.push({
        date: toISODate(activeImpactDate ? activeImpactDate : new Date()),
        name: targetName,
        title: 'active',
        effect: 'repeal',
        origin: 'self',
        id: 'self',
      })
    }

    return sortBy(futureEffectArray, (o) => o.date)
  }, [
    activeImpact,
    activeImpactDate,
    targetName,
    draftImpacts,
    effects?.future,
  ])

  const hasImpactMismatch = !!draftImpacts?.filter(
    (draftImpact) => draftImpact.changingId !== draftId,
  ).length

  return { allFutureEffects, hasImpactMismatch }
}
