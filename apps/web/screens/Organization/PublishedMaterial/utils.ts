import { GenericTag, GenericTagGroup } from '@island.is/web/graphql/schema'

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
  genericTags.forEach((tag) => {
    if (tag.genericTagGroup?.id) {
      genericTagGroupObject[tag.genericTagGroup.id] = tag.genericTagGroup
    }
  })
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

export const extractFilterTags = (filterCategories: FilterCategory[]) => {
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
