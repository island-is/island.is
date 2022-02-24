import React from 'react'
import sortBy from 'lodash/sortBy'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { ImpactListItem } from './ImpactListItem'
import { Effects } from '../../types'
import { DraftImpactForm } from '../../state/types'
import {
  ISODate,
  nameToSlug,
  RegName,
  RegulationHistoryItem,
} from '@island.is/regulations'
import { DraftImpact, RegulationDraftId } from '@island.is/regulations/admin'
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

  const getCurrentEffect = (effect: RegulationHistoryItem | DraftImpact) => {
    return (effect as RegulationHistoryItem).title === 'active'
  }

  const hasMismatchId = (effect: RegulationHistoryItem | DraftImpact) => {
    const effectID = (effect as DraftImpact).changingId
    if (effectID && draftId) {
      return effectID !== draftId
    }

    // Return false if either ID is missing.
    return false
  }

  const getAllFutureEffects = () => {
    const futureEffects = effects?.future ?? []
    const draftImpactsArray = draftImpacts ?? []

    const activeImpactChangeItem: RegulationHistoryItem = {
      date: formatDateFns(
        activeImpact?.date?.value ? activeImpact.date.value : Date.now(),
        'yyyy-MM-dd',
      ) as ISODate,
      name: activeImpact?.name as RegName,
      title: 'active',
      effect: 'repeal',
    }

    const futureEffectArray = [
      ...futureEffects,
      ...draftImpactsArray,
      activeImpactChangeItem,
    ]

    return sortBy(futureEffectArray, (o) => o.date)
  }

  const allFutureEffects = getAllFutureEffects()
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
          Breytingasaga reglugerðar
        </Text>
        <Box className={s.line} marginX={2} />
        <a
          href={`https://island.is/reglugerdir/nr/${nameToSlug(
            activeImpact?.name as RegName,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <Text variant="h5" color="blueberry600">
            Nýjasta útgáfan
          </Text>
        </a>
      </Box>
      {/* <Divider /> */}
      {allFutureEffects.length > 0 ? (
        <>
          <Text variant="eyebrow" marginBottom={2}>
            Væntanlegar breytingar:
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flexStart"
            className={s.history}
          >
            {allFutureEffects.map((effect) => (
              <>
                <ImpactListItem
                  effect={effect}
                  current={getCurrentEffect(effect)}
                  idMismatch={hasMismatchId(effect)}
                  activeName={activeImpact?.name ?? ''}
                  key={`${nameToSlug(activeImpact?.name as RegName)}-${
                    effect.date
                  }`}
                />
                <ImpactListItem
                  effect={effect}
                  current={getCurrentEffect(effect)}
                  idMismatch={hasMismatchId(effect)}
                  activeName={activeImpact?.name ?? ''}
                  key={`${nameToSlug(activeImpact?.name as RegName)}-${
                    effect.date
                  }`}
                />
              </>
            ))}
          </Box>
        </>
      ) : (
        <Text variant="h5" marginBottom={2}>
          Engar breytingar framundan
        </Text>
      )}
    </Box>
  )
}
