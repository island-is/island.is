import { sortAlpha } from '@island.is/shared/utils'
import {
  GetArticleCategoriesQuery,
  GetCategoryPagesQuery,
} from '@island.is/web/graphql/schema'

// adds or removes selected category in hash array
export const updateHashArray = (
  hashArray: string[] | null | undefined,
  categoryId: string | null | undefined,
): string[] => {
  let tempArr = hashArray ?? []
  if (!!categoryId && categoryId.length > 0) {
    if (tempArr.includes(categoryId)) {
      tempArr = (hashArray ?? []).filter((x) => x !== categoryId)
    } else {
      tempArr = tempArr.concat([categoryId])
    }
  }
  return tempArr
}
// gets "active" category that we use to scroll to on inital render
export const getActiveCategory = (
  hashArr: string[] | null | undefined,
): string | null => {
  if (!!hashArr && hashArr.length > 0) {
    const activeCategory = hashArr[hashArr.length - 1].replace('#', '')
    return activeCategory.length > 0 ? activeCategory : null
  }
  return null
}
// creates hash string from array
export const getHashString = (
  hashArray: string[] | null | undefined,
): string => {
  if (!!hashArray && hashArray.length > 0) {
    return hashArray.length > 1 ? hashArray.join(',') : hashArray[0]
  }
  return ''
}
// creates hash array from string
export const getHashArr = (
  hashString: string | null | undefined,
): string[] | null => {
  if (!!hashString && hashString.length > 0) {
    hashString = hashString.replace('#', '')
    return hashString.length > 0 ? hashString.split(',') : null
  }
  return null
}

type CategoryPages = NonNullable<GetCategoryPagesQuery['getCategoryPages']>

export type CategoryGroups = {
  title: string
  description: string
  importance: number
  slug: string
  subgroups: {
    title?: string
    importance: number
    pages: CategoryPages
  }[]
}[]

type Category =
  | {
      title?: string | null
    }
  | null
  | undefined

const isSameCategory = (category1: Category, category2: Category) => {
  return category1?.title === category2?.title
}

type Subgroup =
  | {
      title?: string | null
    }
  | null
  | undefined

const isSameSubGroup = (subgroup1: Subgroup, subgroup2: Subgroup) => {
  return subgroup1?.title === subgroup2?.title
}

const sortPages = (pages: CategoryPages) => {
  // Sort pages by importance (which defaults to 0).
  // If both pages being compared have the same importance we sort by comparing their titles.
  pages.sort((a, b) => {
    if (!a.importance || !b.importance) {
      return a.importance ? -1 : b.importance ? 1 : sortAlpha('title')(a, b)
    }

    return a.importance > b.importance
      ? -1
      : a.importance === b.importance
      ? sortAlpha('title')(a, b)
      : 1
  })
}

const sortSubgroups = (subgroups: CategoryGroups[number]['subgroups']) =>
  subgroups.sort((a, b) => {
    if (!a.title) {
      return 1
    } else if (!b.title) {
      return -1
    }

    if (a?.importance && b?.importance) {
      return a.importance > b.importance
        ? -1
        : a.importance === b.importance
        ? sortAlpha('title')(a, b)
        : 1
    }
    // Fall back to alphabet
    return a.title.localeCompare(b.title)
  })

const sortCategoryGroups = (categoryGroups: CategoryGroups) => {
  // Sort the groups
  categoryGroups.sort((a, b) => {
    if (a.importance > b.importance) return -1
    if (a.importance < b.importance) return 1
    return sortAlpha('title')(a, b)
  })
  for (const group of categoryGroups) {
    sortSubgroups(group.subgroups)
    for (const subgroup of group.subgroups) {
      sortPages(subgroup.pages)
    }
  }
}

const addPageToGroupMap = (
  groupMap: Map<string, CategoryGroups[number]>,
  page: CategoryPages[number],
  pageGroup: CategoryPages[number]['group'],
  pageSubgroup: CategoryPages[number]['subgroup'],
) => {
  const key = pageGroup?.slug

  // We skip adding pages if they don't have a group key
  if (!key) return

  if (!groupMap.has(key)) {
    // Group wasn't found so we create it
    groupMap.set(key, {
      title: pageGroup.title,
      slug: pageGroup.slug,
      importance: pageGroup.importance ?? 0,
      description: pageGroup.description ?? '',
      subgroups: [
        {
          title: pageSubgroup?.title,
          importance: pageSubgroup?.importance ?? 0,
          pages: [page],
        },
      ],
    })

    return
  }

  const group = groupMap.get(key)
  if (!group) return

  const subGroupIndex = group.subgroups.findIndex((subgroup) =>
    isSameSubGroup(subgroup, pageSubgroup),
  )

  if (subGroupIndex < 0) {
    // Subgroup wasn't found so we create it
    group.subgroups.push({
      title: pageSubgroup?.title,
      importance: pageSubgroup?.importance ?? 0,
      pages: [page],
    })
  } else {
    // Subgroup was found so we append the page to it
    group.subgroups[subGroupIndex].pages.push(page)
  }
}

export const extractCategoryGroups = (
  pages: CategoryPages,
  selectedCategory:
    | GetArticleCategoriesQuery['getArticleCategories'][number]
    | undefined,
): CategoryGroups => {
  if (!selectedCategory?.title) return []

  const groupMap = new Map<string, CategoryGroups[number]>()

  for (const page of pages) {
    const mainCategory = page.category
    const secondaryCategory = page.otherCategories?.[0]

    if (isSameCategory(mainCategory, selectedCategory)) {
      addPageToGroupMap(groupMap, page, page.group, page.subgroup)
    } else if (isSameCategory(secondaryCategory, selectedCategory)) {
      addPageToGroupMap(
        groupMap,
        page,
        page.otherGroups?.[0],
        page.otherSubgroups?.[0],
      )
    }
  }

  const categoryGroups = Array.from(groupMap, ([_, value]) => value)
  sortCategoryGroups(categoryGroups)

  return categoryGroups
}
