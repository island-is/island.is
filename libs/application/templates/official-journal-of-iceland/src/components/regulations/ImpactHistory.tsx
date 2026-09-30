/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactHistory.tsx
 * and ImpactListItem.tsx
 *
 * Lists the upcoming changes of a regulation around the impact being edited.
 *
 * Key adaptations:
 * - Takes the effects from getImpactChain instead of RegulationHistoryItemAdmin
 * - Only this draft's own impacts are shown, so there is no draft mismatch state
 */
import { Box, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  nameToSlug,
  prettyName,
  RegName,
  toISODate,
} from '@island.is/regulations'
import { UpcomingEffect } from '../../utils/getImpactChain'
import * as s from './Impacts.css'

// ---------------------------------------------------------------------------

type ImpactHistoryProps = {
  /** The date of the impact being edited */
  impactDate?: Date
  upcoming: UpcomingEffect[]
  targetName: string
}

const DateText = ({ date, color }: { date: string; color: Colors }) => {
  const { formatDateFns } = useLocale()
  return (
    <Text variant="h5" color={color}>
      {formatDateFns(date, 'd. MMM yyyy')}
    </Text>
  )
}

const EffectItem = ({
  effect,
  targetName,
}: {
  effect: UpcomingEffect | { date: string; origin: 'self' }
  targetName: string
}) => {
  if (effect.origin === 'self') {
    return (
      <div>
        <DateText date={effect.date} color="mint800" />
        <Text variant="small" color="mint800">
          Þessi breyting
        </Text>
      </div>
    )
  }

  if (effect.origin === 'draft') {
    return (
      <div>
        <DateText date={effect.date} color="blueberry600" />
        <Text variant="small">
          {effect.effect === 'repeal'
            ? 'Felld brott af þessari reglugerð'
            : 'Önnur breyting í þessari reglugerð'}
        </Text>
      </div>
    )
  }

  return (
    <a
      href={`https://island.is/reglugerdir/nr/${nameToSlug(
        targetName as RegName,
      )}/d/${effect.date}/diff`}
      target="_blank"
      rel="noreferrer"
    >
      <DateText date={effect.date} color="blueberry600" />
      <Text variant="small" color="blueberry600">
        {effect.effect === 'repeal' ? 'Felld brott með' : 'Breytt með'}{' '}
        {effect.name ? prettyName(effect.name as RegName) : ''}
      </Text>
    </a>
  )
}

export const ImpactHistory = ({
  impactDate,
  upcoming,
  targetName,
}: ImpactHistoryProps) => {
  if (!impactDate || targetName === 'self' || upcoming.length === 0) {
    return null
  }

  // Place this impact after the effects on or before its date
  const ownDate = toISODate(impactDate)
  const splitAt = upcoming.filter((effect) => effect.date <= ownDate).length
  const effects = [
    ...upcoming.slice(0, splitAt),
    { date: ownDate, origin: 'self' as const },
    ...upcoming.slice(splitAt),
  ]

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
          Væntanlegar breytingar á reglugerð {prettyName(targetName as RegName)}
        </Text>
        <Box className={s.line} marginX={2} />
        <a
          href={`https://island.is/reglugerdir/nr/${nameToSlug(
            targetName as RegName,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <Text variant="h5" color="blueberry600">
            Sjá núgildandi
          </Text>
        </a>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="flexStart"
        className={s.history}
      >
        {effects.map((effect, i) => (
          <EffectItem
            key={`${effect.origin}_${effect.date}_${i}`}
            effect={effect}
            targetName={targetName}
          />
        ))}
      </Box>
    </Box>
  )
}
