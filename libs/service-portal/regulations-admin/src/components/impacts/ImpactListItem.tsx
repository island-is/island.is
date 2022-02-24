import React from 'react'
import { Colors } from '@island.is/island-ui/theme'
import { Text } from '@island.is/island-ui/core'
import {
  nameToSlug,
  RegName,
  RegulationHistoryItem,
} from '@island.is/regulations'
import { DraftImpact } from '@island.is/regulations/admin'
import { useLocale } from '@island.is/localization'

export type ImpactListItemProps = {
  effect: RegulationHistoryItem | DraftImpact
  current: boolean
  idMismatch: boolean
  activeName: string
}

export type DateTextProps = { date: string; color: Colors }

const DateText = ({ date, color }: DateTextProps) => {
  const { formatDateFns } = useLocale()
  return (
    <Text variant="h5" color={color}>
      {formatDateFns(date as string, 'd. MMM yyyy')}
    </Text>
  )
}

export const ImpactListItem = (props: ImpactListItemProps) => {
  const { effect, current, idMismatch, activeName } = props

  const getCurrentEffect = (effect: RegulationHistoryItem | DraftImpact) => {
    return (effect as RegulationHistoryItem).title === 'active'
  }

  if (idMismatch) {
    // TODO: This needs design.
    return (
      <div>
        <DateText date={effect.date as string} color="red600" />
        <Text variant="small" color="red600">
          Villa! Sama reglugerð er í vinnslu annarsstaðar.
        </Text>
      </div>
    )
  }

  if (current) {
    return (
      <div>
        <DateText date={effect.date as string} color="mint800" />
        <Text variant="small" color="mint800">
          Breytt af núverandi reglugerð
        </Text>
      </div>
    )
  }

  return (
    <a
      href={`https://island.is/reglugerdir/nr/${nameToSlug(
        activeName as RegName,
      )}/d/${effect.date}/diff`}
      target="_blank"
      rel="noreferrer"
    >
      <DateText date={effect.date as string} color="blueberry600" />
      <Text
        variant="small"
        color={getCurrentEffect(effect) ? 'mint800' : 'blueberry600'}
      >
        Breytt af{' '}
        {getCurrentEffect(effect) ? 'núverandi reglugerð' : effect.name}
      </Text>
    </a>
  )
}
