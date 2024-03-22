import {
  MinistryOfJusticeAdvertCategory,
  MinistryOfJusticeAdvertEntity,
  MinistryOfJusticeAdvertMainCategory,
  MinistryOfJusticeAdvertType,
} from '@island.is/api/schema'
import { StringOption as Option } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

export const baseUrl = '/s/stjornartidindi'
export const searchUrl = baseUrl + '/leit'
export const categoriesUrl = baseUrl + '/malaflokkar'
export const advertUrl = baseUrl + '/nr'

export const splitArrayIntoGroups = <T>(array: Array<T>, groupSize: number) => {
  const groups = []
  for (let i = 0; i < array.length; i += groupSize) {
    groups.push(array.slice(i, i + groupSize))
  }
  return groups
}

export const removeEmptyFromObject = (obj: Record<string, string>) => {
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
  mainCategory?: string
  department?: string
}

export const mapEntityToOptions = (
  entities?: Array<
    | MinistryOfJusticeAdvertEntity
    | MinistryOfJusticeAdvertType
    | MinistryOfJusticeAdvertCategory
    | MinistryOfJusticeAdvertMainCategory
  >,
): EntityOption[] => {
  if (!entities) {
    return []
  }
  return entities.map((e) => {
    return {
      label: e.title,
      value: e.slug,
    }
  })
}

export const sortCategories = (cats: EntityOption[]) => {
  return cats.sort((a, b) => {
    return sortAlpha('title')(a, b)
  })
}
