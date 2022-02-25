import React, { Fragment, useMemo } from 'react'
import sortBy from 'lodash/sortBy'
import { Box, Text } from '@island.is/island-ui/core'
import { ImpactListItem } from './ImpactListItem'
import { Effects } from '../../types'
import { DraftImpactForm } from '../../state/types'
import {
  ISODate,
  nameToSlug,
  prettyName,
  RegName,
  toISODate,
} from '@island.is/regulations'
import {
  DraftImpact,
  RegulationDraftId,
  RegulationHistoryItemAdmin,
} from '@island.is/regulations/admin'
import { useLocale } from '@island.is/localization'
import * as s from './Impacts.css'

export type ImpactHistoryProps = {
  effects?: Effects
  activeImpact?: DraftImpactForm
  draftImpacts?: DraftImpact[]
  draftId?: RegulationDraftId
}

export const ImpactHistory = (props: ImpactHistoryProps) => {
  const { effects, activeImpact, draftImpacts, draftId } = props
  const { formatDateFns } = useLocale()

  const hasMismatchId = (effect: RegulationHistoryItemAdmin | DraftImpact) => {
    const effectID = (effect as DraftImpact).changingId
    if (effectID && draftId) {
      return effectID !== draftId
    }

    // Return false if either ID is missing.
    return false
  }

  const targetName = activeImpact?.name as RegName
  const activeImpactDate = activeImpact?.date?.value

  const allFutureEffects = useMemo(() => {
    if (!activeImpact) return []

    const futureEffects: RegulationHistoryItemAdmin[] =
      effects?.future.map((f) => ({ ...f, origin: 'api', id: 'api' })) ?? []
    const draftImpactsArray: RegulationHistoryItemAdmin[] =
      draftImpacts?.map((i) => ({
        id: i.id,
        date: i.date as ISODate,
        name: i.name as RegName,
        title: '',
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
    formatDateFns,
  ])

  if (!activeImpact) {
    return null
  }

  return (
    <Box background="blueberry100" paddingY={3} paddingX={4} marginBottom={7}>
      <Box
        className={s.border}
        display="flex"
        alignItems="flexEnd"
        borderBottomWidth="standard"
        borderColor="purple200"
      >
        <Text variant="h4" color="blueberry600">
          Væntanlegar breytingar á{' '}
          {targetName === 'self'
            ? 'reglugerðinni'
            : `reglugerð ${prettyName(targetName)}`}
        </Text>
        <Box className={s.line} marginX={2} />
        {targetName !== 'self' && (
          <a
            href={`https://island.is/reglugerdir/nr/${nameToSlug(targetName)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Text variant="h5" color="blueberry600">
              Nýjasta útgáfan
            </Text>
          </a>
        )}
      </Box>
      {/* <Divider /> */}
      {allFutureEffects.length > 0 ? (
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flexStart"
          className={s.history}
        >
          {allFutureEffects.map((effect) => (
            <ImpactListItem
              key={targetName + '_' + effect.date}
              effect={effect}
              idMismatch={hasMismatchId(effect)}
              activeName={targetName}
            />
          ))}
        </Box>
      ) : (
        <Text variant="h5" marginBottom={2}>
          Engar breytingar framundan
        </Text>
      )}
    </Box>
  )
}
