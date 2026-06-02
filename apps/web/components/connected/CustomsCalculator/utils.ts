import type { FilterMultiChoiceProps } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import { CustomsCalculatorProductCategory } from '@island.is/web/graphql/schema'

type FilterCategory = FilterMultiChoiceProps['categories'][number]

export const extractFilterCategories = (
  productCategories: CustomsCalculatorProductCategory[],
): FilterMultiChoiceProps['categories'] => {
  const parentCategoryMap = new Map<
    string,
    CustomsCalculatorProductCategory[]
  >()

  for (const category of productCategories) {
    const parent = category.parentCategory?.trim()
    if (!parent) {
      // TODO: What should we do here?
      continue
    }
    const list = parentCategoryMap.get(parent) ?? []
    list.push(category)
    parentCategoryMap.set(parent, list)
  }

  const filterCategories: FilterCategory[] = []

  for (const [parent, categories] of parentCategoryMap.entries()) {
    const sortedCategories = categories
      .filter(
        (
          c,
        ): c is CustomsCalculatorProductCategory & {
          tariffNumber: string
          category: string
        } => Boolean(c.tariffNumber) && Boolean(c.category),
      )
      .map((category) => ({
        value: category.tariffNumber,
        label: category.category,
      }))
      .sort(sortAlpha('label'))

    filterCategories.push({
      id: parent,
      label: parent,
      selected: [],
      filters: sortedCategories,
      singleOption: true,
    })
  }

  filterCategories.sort(sortAlpha('label'))

  return filterCategories
}

type Category = CustomsCalculatorProductCategory & {
  children?: Category[]
}

export const est = (productCategories: CustomsCalculatorProductCategory[]) => {
  const topDownMap = new Map<string, string[]>()
  let categoryStrings = productCategories
    .map((category) => category.category)
    .filter(Boolean)

  while (categoryStrings.length > 0) {
    const next: string[] = []
    for (const categoryString of categoryStrings) {
      const category = productCategories.find(
        (category) => category.category === categoryString,
      )
      if (!category?.parentCategory || !category.category) continue
      if (!topDownMap.has(category.parentCategory))
        topDownMap.set(category.parentCategory, [category.category])
      topDownMap.get(category.parentCategory)?.push(category.category)

      next.push(category.parentCategory)
    }
    categoryStrings = next
  }

  return topDownMap
}
