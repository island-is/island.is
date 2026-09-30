/**
 * Ported from the impact chaining in
 * libs/portals/admin/regulations-admin/src/components/impacts/EditChange.tsx
 *
 * A regulation can be changed more than once by the same amending
 * regulation, e.g. when parts of it take effect on different dates. Each
 * change stores the full text of the regulation after it, so a change must
 * build on the one before it rather than on the published text.
 */
import { toISODate } from '@island.is/regulations'
import type { RegulationHistoryItem } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'

type ImpactChainInput = {
  /** The impact being edited or created */
  impact: RegulationImpactSchema
  /** This draft's impacts on the same regulation */
  impacts: RegulationImpactSchema[]
  /** History of the regulation from the API, including scheduled changes */
  history?: RegulationHistoryItem[]
  /** The earliest date allowed regardless of other changes */
  defaultMinDate: Date
  /** The date picked for the impact, if it differs from the saved one */
  selectedDate?: string
  today?: Date
}

export type UpcomingEffect = {
  date: string
  effect: 'amend' | 'repeal'
  /** 'api' for changes by other regulations, 'draft' for this draft's own */
  origin: 'api' | 'draft'
  /** The affecting regulation, for 'api' effects */
  name?: string
}

type ImpactChain = {
  /** The change this one builds on, if any */
  previous?: RegulationImpactSchema
  /** The earliest date this impact can take effect */
  minDate: Date
  /** Whether the API has scheduled changes up to minDate that aren't published yet */
  hasFutureEffects: boolean
  /** The date of a repeal before this change, after which it can't apply */
  repealedOn?: string
  /** Scheduled changes and this draft's other impacts, by date */
  upcoming: UpcomingEffect[]
}

const laterOf = (a: Date, b: Date) => (b.getTime() > a.getTime() ? b : a)

export const getImpactChain = ({
  impact,
  impacts,
  history = [],
  defaultMinDate,
  selectedDate,
  today = new Date(),
}: ImpactChainInput): ImpactChain => {
  // Keep the saved order for impacts on the same day
  const sorted = impacts
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        (a.item.date ?? '').localeCompare(b.item.date ?? '') ||
        a.index - b.index,
    )
    .map(({ item }) => item)

  const ownIndex = sorted.findIndex((item) => item.id === impact.id)
  const isExisting = ownIndex !== -1
  const earlier = isExisting ? sorted.slice(0, ownIndex) : sorted

  const previous = earlier
    .filter((item) => item.type === 'amend' && item.text)
    .slice(-1)[0]

  const todayISO = toISODate(today)
  const scheduled = history.filter((item) => item.date > todayISO)
  // An existing impact only has to follow what comes before it
  const futureEffects = scheduled.filter(
    (item) => !isExisting || !impact.date || item.date <= impact.date,
  )

  const minDate = [
    ...earlier.map((item) => item.date),
    ...futureEffects.map((item) => item.date),
  ]
    .filter((date): date is string => !!date)
    .reduce((min, date) => laterOf(min, new Date(date)), defaultMinDate)

  // A scheduled repeal blocks an existing change if the picked date is after it
  const ownDate = selectedDate ?? impact.date
  const repealedOn =
    impact.type === 'amend'
      ? [
          ...earlier.filter((item) => item.type === 'repeal'),
          ...scheduled.filter(
            (item) =>
              item.effect === 'repeal' &&
              (!isExisting || !ownDate || item.date <= ownDate),
          ),
        ]
          .map((item) => item.date)
          .filter((date): date is string => !!date)
          .sort()[0]
      : undefined

  const upcoming = [
    ...scheduled.map(
      (item): UpcomingEffect => ({
        date: item.date,
        effect: item.effect,
        origin: 'api',
        name: item.name,
      }),
    ),
    ...sorted
      .filter((item) => item.id !== impact.id && item.date)
      .map(
        (item): UpcomingEffect => ({
          date: item.date as string,
          effect: item.type,
          origin: 'draft',
        }),
      ),
  ].sort((a, b) => a.date.localeCompare(b.date))

  return {
    previous,
    minDate,
    hasFutureEffects: futureEffects.length > 0,
    repealedOn,
    upcoming,
  }
}
