import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { StringOption as Option } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import {
  OfficialJournalOfIcelandAdvertCategory,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandAdvertMainCategory,
  OfficialJournalOfIcelandAdvertType,
} from '@island.is/web/graphql/schema'

export const splitArrayIntoGroups = <T>(array: Array<T>, groupSize: number) => {
  return Array.from({ length: Math.ceil(array.length / groupSize) }, (_, i) =>
    array.slice(i * groupSize, (i + 1) * groupSize),
  )
}

export const removeEmptyFromObject = (
  obj: Record<string, string | number | Date | undefined>,
) => {
  return Object.entries(obj)
    .filter(([_, v]) => !!v)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}

export const emptyOption = (label?: string): Option => ({
  label: label ? `– ${label} –` : '—',
  value: '',
})

export const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
) => {
  // NOTE: The returned option MUST NOT be a copy (with trimmed value,
  // even if it would look nicer) because react-select seems to do an
  // internal `===` comparison against the options list, and thus copies
  // will fail to appear selected in the dropdown list.
  return (value && options.find((opt) => opt.value === value)) || null
}

export type EntityOption = Option & {
  mainCategory?: OfficialJournalOfIcelandAdvertMainCategory
  department?: OfficialJournalOfIcelandAdvertEntity
}

type Entity =
  | OfficialJournalOfIcelandAdvertEntity
  | OfficialJournalOfIcelandAdvertType
  | OfficialJournalOfIcelandAdvertCategory
  | OfficialJournalOfIcelandAdvertMainCategory

export const mapEntityToOptions = (
  entities?: Array<Entity>,
): EntityOption[] => {
  if (!entities) {
    return []
  }
  const sortedEntities = [...entities].sort(sortAlpha<Entity>('title'))

  // Combine duplicate titles for OfficialJournalOfIcelandAdvertType
  if (sortedEntities[0]?.__typename === 'OfficialJournalOfIcelandAdvertType') {
    const combinedTypes = sortedEntities.reduce<Record<string, string[]>>(
      (acc, entity) => {
        const e = entity as OfficialJournalOfIcelandAdvertType
        if (!acc[e.title]) {
          acc[e.title] = []
        }
        acc[e.title].push(e.slug)
        return acc
      },
      {},
    )

    return Object.entries(combinedTypes).map(([title, slugs]) => ({
      label: title,
      value: slugs.join(','),
    }))
  }
  return sortedEntities.map((e) => {
    if (e.__typename === 'OfficialJournalOfIcelandAdvertCategory') {
      return {
        label: e.title,
        value: e.slug,
        mainCategory: e.mainCategory ?? undefined,
        department: e.department ?? undefined,
      }
    }
    return {
      label: e.title,
      value: e.slug,
    }
  })
}

export const mapYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const firstYear = 1995 // The oldest available year in OJOI

  const years: { label: string; value: string }[] = Array.from(
    { length: currentYear - firstYear + 1 },
    (_, i) => {
      const year = (firstYear + i).toString()
      return { label: year, value: year }
    },
  ).reverse()
  return years
}

export const sortCategories = (cats: EntityOption[]) => {
  return [...cats].sort(sortAlpha('label'))
}

export const formatDate = (date?: string, df = 'dd.MM.yyyy') => {
  if (!date) {
    return '-'
  }
  try {
    return format(new Date(date), df, { locale: is })
  } catch (e) {
    throw new Error(`Could not format date: ${date}`)
  }
}

export const getStringArrayFromQueryString = (
  value?: string | string[],
): string[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return value.split(',')
}

export const getStringFromQueryString = (
  value?: string | string[],
): string | undefined => {
  if (!value) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}
