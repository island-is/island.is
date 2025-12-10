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
    const tagIds = new Set<string>()
    const filters: { value: string; label: string }[] = genericTags
      .filter((tag) => tag.genericTagGroup?.id === tagGroup.id)
      .map((tag) => {
        if (tagIds.has(tag.id)) {
          return null
        }
        tagIds.add(tag.id)
        return { value: tag.slug, label: tag.title }
      })
      .filter(Boolean) as NonNullable<typeof filters>
    return {
      id: tagGroup.slug,
      label: tagGroup.title,
      selected: [],
      filters,
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
      ) ?? { label: selection, value: selection }

      filterTags.push({ ...data, category: filterCategory.id })
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
