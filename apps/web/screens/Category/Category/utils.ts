import {
  ArticleCategory,
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

export type CategoryPages = NonNullable<
  GetCategoryPagesQuery['getCategoryPages']
>

type CategoryGroups = {
  title: string
  description: string
  slug: string
  subgroups: {
    title?: string
    importance: number
    pages: CategoryPages
  }[]
}[]

export type ArticleCategories =
  GetArticleCategoriesQuery['getArticleCategories']

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

export const extractCategoryGroups = (
  pages: CategoryPages,
  selectedCategory: ArticleCategories[number],
): CategoryGroups => {
  if (!selectedCategory?.title) return []

  const groupMap = new Map<string, CategoryGroups[number]>()

  for (const page of pages) {
    const pageCategory = page.category
    const pageGroup = page.group
    const pageSubgroup = page.subgroup

    const pageSecondaryCategory = page.otherCategories?.[0]
    const pageSecondaryGroup = page.otherGroups?.[0]
    const pageSecondarySubgroup = page.otherSubgroups?.[0]

    // Main category matches selected category
    if (isSameCategory(pageCategory, selectedCategory) && pageGroup?.slug) {
      const key = pageGroup.slug

      if (!groupMap.has(key)) {
        // Group wasn't found so we create it
        groupMap.set(key, {
          title: pageGroup.title,
          slug: pageGroup.slug,
          description: pageGroup.description ?? '',
          subgroups: [
            {
              title: pageSubgroup?.title ?? '',
              importance: pageSubgroup?.importance ?? 0,
              pages: [page],
            },
          ],
        })
      } else {
        const group = groupMap.get(key)
        if (!group) continue

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
    }

    // "Secondary" category matches selected category
    else if (
      isSameCategory(pageSecondaryCategory, selectedCategory) &&
      pageSecondaryGroup?.slug
    ) {
      const key = pageSecondaryGroup.slug

      if (!groupMap.has(key)) {
        // Group wasn't found so we create it
        groupMap.set(key, {
          title: pageSecondaryGroup.title,
          slug: pageSecondaryGroup.slug,
          description: pageSecondaryGroup.description ?? '',
          subgroups: [
            {
              title: pageSecondarySubgroup?.title ?? '',
              importance: pageSecondarySubgroup?.importance ?? 0,
              pages: [page],
            },
          ],
        })
      } else {
        const group = groupMap.get(key)
        if (!group) continue

        const subGroupIndex = group.subgroups.findIndex((subgroup) =>
          isSameSubGroup(subgroup, pageSecondarySubgroup),
        )

        if (subGroupIndex < 0) {
          // Subgroup wasn't found so we create it
          group.subgroups.push({
            title: pageSecondarySubgroup?.title,
            importance: pageSecondarySubgroup?.importance ?? 0,
            pages: [page],
          })
        } else {
          // Subgroup was found so we append the page to it
          group.subgroups[subGroupIndex].pages.push(page)
        }
      }
    }
  }

  const categoryGroups = Array.from(groupMap, ([_, value]) => value)

  // TODO: sort

  return categoryGroups
}
