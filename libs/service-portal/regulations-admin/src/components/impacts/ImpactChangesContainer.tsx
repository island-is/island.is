import React from 'react'
import sortBy from 'lodash/sortBy'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { Effects } from '../../types'
import { DraftCancelForm } from '../../state/types'
import {
  nameToSlug,
  RegName,
  RegulationHistoryItem,
} from '@island.is/regulations'
import { useLocale } from '@island.is/localization'

export type ImpactChangesContainerProps = {
  effects?: Effects
  activeCancellation?: DraftCancelForm
}

export const ImpactChangesContainer = (props: ImpactChangesContainerProps) => {
  const { effects, activeCancellation } = props
  const { formatDateFns } = useLocale()
  const futureEffects = effects?.future ?? []

  const getCurrentEffect = (effect: RegulationHistoryItem) => {
    return effect.name === activeCancellation?.name
  }

  const getAllFutureEffects = () => {
    const activeCancellationChangeItem = {
      date: formatDateFns(
        activeCancellation?.date?.value
          ? activeCancellation.date.value
          : Date.now(),
        'yyyy-MM-dd',
      ),
      name: activeCancellation?.name,
      title: activeCancellation?.regTitle,
      effect: 'amend',
    } as RegulationHistoryItem

    const futureEffectArray = [...futureEffects]

    if (activeCancellation) {
      futureEffectArray.push(activeCancellationChangeItem)
    }

    const futureEffectsByDate = sortBy(futureEffectArray, (o) => o.date)

    return futureEffectsByDate
  }

  const allFutureEffects = getAllFutureEffects()
  return (
    <Box background="blueberry100" paddingY={3} paddingX={4} marginTop={10}>
      <Text variant="h4" color="blueberry600" marginBottom={3}>
        Breytingasaga reglugerðar
      </Text>
      <Divider />
      <a
        href={`https://island.is/reglugerdir/nr/${nameToSlug(
          activeCancellation?.name as RegName,
        )}`}
        target="_blank"
        rel="noreferrer"
      >
        <Text variant="h5" color="blueberry600" paddingTop={3} marginBottom={3}>
          Nýjasta útgáfan
        </Text>
      </a>
      {allFutureEffects.length > 0 ? (
        <>
          <Text variant="eyebrow" marginBottom={2}>
            Væntanlegar breytingar:
          </Text>
          {allFutureEffects.map((effect) => (
            <a
              href={`https://island.is/reglugerdir/nr/${nameToSlug(
                activeCancellation?.name as RegName,
              )}/d/${effect.date}/diff`}
              target="_blank"
              rel="noreferrer"
              key={`${nameToSlug(activeCancellation?.name as RegName)}-${
                effect.date
              }`}
            >
              <Text
                variant="h5"
                color={getCurrentEffect(effect) ? 'red600' : 'blueberry600'}
              >
                {formatDateFns(effect.date, 'd. MMM yyyy')}
              </Text>
              <Text
                variant="small"
                color={getCurrentEffect(effect) ? 'red600' : 'blueberry600'}
                marginBottom={2}
              >
                Breytt af{' '}
                {getCurrentEffect(effect) ? 'núverandi reglugerð' : effect.name}
              </Text>
            </a>
          ))}
        </>
      ) : (
        <Text variant="h5" marginBottom={2}>
          Engar breytingar framundan
        </Text>
      )}
    </Box>
  )
}
