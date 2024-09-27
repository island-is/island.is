import { Colors } from '@island.is/island-ui/theme'
import { Text } from '@island.is/island-ui/core'
import { nameToSlug, RegName } from '@island.is/regulations'
import { RegulationHistoryItemAdmin } from '@island.is/regulations/admin'
import { useLocale } from '@island.is/localization'

export type ImpactListItemProps = {
  effect: RegulationHistoryItemAdmin
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
  const { effect, idMismatch, activeName } = props

  const getCurrentEffect = (effect: RegulationHistoryItemAdmin) => {
    return effect.title === 'active'
  }

  if (idMismatch) {
    return (
      <div>
        <DateText date={effect.date as string} color="red600" />
        <Text variant="small" color="red600">
          Villa! Sama reglugerð er í vinnslu annarsstaðar.
        </Text>
      </div>
    )
  }

  if (effect.origin === 'self') {
    return (
      <div>
        <DateText date={effect.date as string} color="mint800" />
        <Text variant="small" color="mint800">
          Þessi breyting
        </Text>
      </div>
    )
  }

  if (effect.origin === 'admin') {
    return (
      <div>
        <DateText date={effect.date as string} color="blueberry600" />
        <Text variant="small">Breytt af virkri reglugerð</Text>
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
        Breytt með{' '}
        {getCurrentEffect(effect) ? 'núverandi reglugerð' : effect.name}
      </Text>
    </a>
  )
}
