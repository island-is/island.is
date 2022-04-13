import {
  GenericTag,
  GenericTagGroup,
  GetPublishedMaterialInput,
  GetPublishedMaterialObject,
} from '@island.is/web/graphql/schema'

export interface Ordering {
  field: 'title.sort' | 'releaseDate'
  order: 'asc' | 'desc'
}

interface FilterCategory {
  id: string
  label: string
  selected: string[]
  filters: {
    value: string
    label: string
  }[]
}

interface FilterTag {
  value: string
  label: string
  category: string
}

export const getAllGenericTagGroups = (genericTags: GenericTag[]) => {
  const genericTagGroupObject: Record<string, GenericTagGroup> = {}
  genericTags.forEach(
    (tag) =>
      (genericTagGroupObject[tag.genericTagGroup.id] = tag.genericTagGroup),
  )
  return Object.keys(genericTagGroupObject).map(
    (key) => genericTagGroupObject[key],
  )
}

export const getFilterCategories = (
  genericTags: GenericTag[],
): FilterCategory[] => {
  const genericTagGroups = getAllGenericTagGroups(genericTags)
  return genericTagGroups.map((tagGroup) => {
    return {
      id: tagGroup.slug,
      label: tagGroup.title,
      selected: [],
      filters: genericTags
        .filter((tag) => tag.genericTagGroup?.id === tagGroup.id)
        .map((tag) => ({ value: tag.slug, label: tag.title })),
    }
  })
}

export const getInitialParameters = (filterCategories: FilterCategory[]) => {
  const parameters: Record<string, string[]> = {}
  filterCategories.forEach(({ id }) => (parameters[id] = []))
  return parameters
}

export const getFilterTags = (filterCategories: FilterCategory[]) => {
  const filterTags: FilterTag[] = []

  filterCategories.forEach((filterCategory) =>
    filterCategory.selected.forEach((selection) => {
      const data = filterCategory.filters.find(
        ({ value }) => value === selection,
      )
      if (data) filterTags.push({ ...data, category: filterCategory.id })
    }),
  )

  return filterTags.filter(Boolean)
}

export const getGenericTagGroupHierarchy = (
  filterCategories: FilterCategory[],
): Record<string, string[]> => {
  const hierarchy: Record<string, string[]> = {}

  filterCategories.forEach((filterCategory) => {
    hierarchy[filterCategory.id] = filterCategory.filters.map(
      ({ value }) => value,
    )
  })

  return hierarchy
}

export const responseInputMatchesRequestInput = (
  responseInput: Partial<Omit<GetPublishedMaterialObject, '__typename'>>,
  requestInput: GetPublishedMaterialInput,
) => {
  if (responseInput?.lang !== requestInput.lang) {
    return false
  }
  if (responseInput?.organizationSlug !== requestInput.organizationSlug) {
    return false
  }
  if (responseInput?.page !== requestInput.page) {
    return false
  }
  if (responseInput?.searchString !== requestInput.searchString) {
    return false
  }
  if (responseInput?.size !== requestInput.size) {
    return false
  }

  const responseInputSort = responseInput?.sort ?? {}

  for (const key in Object.keys(responseInputSort)) {
    for (const subKey in Object.keys(responseInputSort[key] ?? {})) {
      if (responseInput[key][subKey] !== requestInput[key]?.[subKey]) {
        return false
      }
    }
  }

  const responseTagGroups = responseInput?.tagGroups ?? {}

  for (const key in Object.keys(responseTagGroups)) {
    if (!responseTagGroups[key]?.length) {
      continue
    }
    for (let i = 0; i < responseTagGroups[key].length; i += 1) {
      if (
        responseTagGroups?.[key]?.[i] !== requestInput.tagGroups?.[key]?.[i]
      ) {
        return false
      }
    }
  }

  if (responseInput?.tags?.length !== requestInput.tags.length) {
    return false
  }

  for (let i = 0; i < responseInput.tags.length; i += 1) {
    if (responseInput.tags[i] !== requestInput.tags[i]) {
      return false
    }
  }

  return true
}
