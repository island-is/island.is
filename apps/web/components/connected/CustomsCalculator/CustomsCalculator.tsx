import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Icon,
  Inline,
  Stack,
  type StringOption,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  CustomsCalculatorProductCategoriesQuery,
} from '@island.is/web/graphql/schema'
import {
  GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
  GET_CUSTOMS_CALCULATOR_UNITS,
} from '@island.is/web/screens/queries/CustomsCalculator'

import { CategoryModal } from './CategoryModal'
import { translation as translationStrings } from './translation.strings'
import { Units } from './Units'
import * as styles from './CustomsCalculator.css'

interface CategoryNode {
  id: string
  label: string
  description?: string | null
  children?: CategoryNode[]
}

const normalizeSearchInput = (searchInput: string) =>
  searchInput.replace('´', '').toLowerCase()

const HighlightedKeyword = ({
  keyword,
  searchInput,
}: {
  keyword: string
  searchInput: string
}) => {
  const lowerCaseKeyword = keyword.toLowerCase()
  // Indices into the lowercased string only line up with the original when
  // lowercasing doesn't change its length (it can for e.g. 'İ').
  const index =
    searchInput && lowerCaseKeyword.length === keyword.length
      ? lowerCaseKeyword.indexOf(searchInput)
      : -1
  if (index < 0) return <>{keyword}</>
  return (
    <>
      {keyword.slice(0, index)}
      <Text as="span" variant="small" fontWeight="semiBold">
        {keyword.slice(index, index + searchInput.length)}
      </Text>
      {keyword.slice(index + searchInput.length)}
    </>
  )
}

const findCategoryNodePath = (
  categories: CategoryNode[],
  targetId: string,
  path: CategoryNode[] = [],
): CategoryNode[] | null => {
  for (const category of categories) {
    if (category.id === targetId) return path
    if (category.children?.length) {
      const result = findCategoryNodePath(category.children, targetId, [
        ...path,
        category,
      ])
      if (result !== null) return result
    }
  }
  return null
}

const findCategoryPath = (categories: CategoryNode[], targetId: string) =>
  findCategoryNodePath(categories, targetId)?.map((category) => ({
    label: category.label,
    value: category.id,
  })) ?? null

interface CustomsCalculatorProps {
  slice: ConnectedComponent
}

const CustomsCalculator = ({ slice }: CustomsCalculatorProps) => {
  const { formatMessage } = useIntl()

  const currencyOptions = useMemo<StringOption[]>(() => {
    return (
      slice.json?.currencyOptions ?? [
        // Most commonly used currencies first, the rest alphabetically
        { label: 'ISK', value: 'ISK', description: 'Íslensk króna' },
        { label: 'EUR', value: 'EUR', description: 'Evra' },
        { label: 'USD', value: 'USD', description: 'Bandaríkjadalur' },
        { label: 'GBP', value: 'GBP', description: 'Sterlingspund' },
        { label: 'AUD', value: 'AUD', description: 'Ástralíudalur' },
        { label: 'CAD', value: 'CAD', description: 'Kanadadalur' },
        { label: 'CHF', value: 'CHF', description: 'Svissneskur franki' },
        { label: 'DKK', value: 'DKK', description: 'Dönsk króna' },
        { label: 'HKD', value: 'HKD', description: 'Hong Kong dalur' },
        { label: 'INR', value: 'INR', description: 'Indversk Rúpía' },
        { label: 'JPY', value: 'JPY', description: 'Japanskt jen' },
        { label: 'NOK', value: 'NOK', description: 'Norsk króna' },
        { label: 'NZD', value: 'NZD', description: 'Ný-Sjálenskur dalur' },
        { label: 'PLN', value: 'PLN', description: 'Pólskt slot' },
        { label: 'SEK', value: 'SEK', description: 'Sænsk króna' },
        { label: 'SGD', value: 'SGD', description: 'Singapúrskur dalur' },
        { label: 'THB', value: 'THB', description: 'Taílenskt bat' },
        { label: 'TWD', value: 'TWD', description: 'Tævanskur dalur' },
      ]
    )
  }, [slice.json?.currencyOptions])

  const [inputState, setInputState] = useState({
    searchInput: '',
  })

  const productCategoriesResponse =
    useQuery<CustomsCalculatorProductCategoriesQuery>(
      GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
    )

  const shortcuts = useMemo<{ label: string; value: string }[]>(() => {
    const labels = slice.configJson?.productCategoryShortcutLabels ?? []
    const shortcuts: { label: string; value: string }[] = []
    for (const label of labels) {
      const category =
        productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
          (category) => category.label === label,
        )
      if (category)
        shortcuts.push({ label: category.label, value: category.id })
    }
    return shortcuts
  }, [
    slice.configJson?.productCategoryShortcutLabels,
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.bottomLevel,
  ])

  const [selectedCategory, setSelectedCategory] = useState({
    current: null as {
      label: string
      value: string
    } | null,
    breadcrumbs: [] as { label: string; value: string }[],
  })

  const categoryOptions = useMemo(() => {
    const categories =
      productCategoriesResponse.data?.customsCalculatorProductCategories
        ?.topLevel ?? []

    if (selectedCategory.current?.value) {
      const stack = [...categories]
      while (stack.length > 0) {
        const category = stack.pop()
        if (!category) continue
        if (category.id === selectedCategory.current.value)
          return category.children.map((child) => ({
            label: child.label,
            value: child.id,
            hasChildren: child.children.length > 0,
          }))
        stack.push(...(category.children as typeof stack))
      }
    }

    return categories.map((category) => ({
      label: category.label,
      value: category.id,
      hasChildren: category.children.length > 0,
    }))
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.topLevel,
    selectedCategory,
  ])

  const normalizedSearchInput = normalizeSearchInput(inputState.searchInput)

  const searchOptions = useMemo<AsyncSearchOption[]>(() => {
    const options: AsyncSearchOption[] = []
    for (const category of productCategoriesResponse.data
      ?.customsCalculatorProductCategories?.bottomLevel ?? []) {
      options.push({
        label: category.label,
        value: category.id,
        component: ({ active }) => (
          <Box
            background={active ? 'blue100' : undefined}
            className={styles.categoryOption}
            cursor="pointer"
            paddingY={2}
            paddingX={2}
          >
            <Stack space={1}>
              {category.parentLabels.length > 0 && (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  {category.parentLabels.map((parentLabel, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <Text variant="small" color="blue600">
                        {parentLabel}
                      </Text>
                      {index < category.parentLabels.length - 1 && (
                        <Icon
                          icon="chevronForward"
                          color="blue600"
                          size="small"
                          ariaHidden={true}
                          className={styles.chevronForward}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              <Text variant="h5" color="blue600">
                {category.label}
              </Text>
              {category.keywords.length > 0 && (
                <Text variant="small">
                  {formatMessage(translationStrings.keywordsLabel)}:{' '}
                  {category.keywords.map((keyword, index) => (
                    <span key={index}>
                      <HighlightedKeyword
                        keyword={keyword}
                        searchInput={normalizedSearchInput}
                      />
                      {index < category.keywords.length - 1 && ', '}
                    </span>
                  ))}
                </Text>
              )}
            </Stack>
          </Box>
        ),
      })
    }
    return options
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.bottomLevel,
    normalizedSearchInput,
    formatMessage,
  ])

  const keywordsByCategoryId = useMemo(() => {
    const keywordsByCategoryId = new Map<string, string[]>()
    for (const category of productCategoriesResponse.data
      ?.customsCalculatorProductCategories?.bottomLevel ?? []) {
      keywordsByCategoryId.set(
        category.id,
        (category.keywords ?? []).map((keyword) => keyword.toLowerCase()),
      )
    }
    return keywordsByCategoryId
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.bottomLevel,
  ])

  const [selectedBottomLevelCategory, setSelectedBottomLevelCategory] =
    useState<{
      label: string
      id: string
      tariffNumber: string
      description: string
    } | null>(null)

  // Descriptions of the selected category and all of its ancestors, ordered
  // from the top level category down to the bottom level one
  const categoryDescriptions = useMemo(() => {
    if (!selectedBottomLevelCategory) return []
    const topLevel = (productCategoriesResponse.data
      ?.customsCalculatorProductCategories?.topLevel ?? []) as CategoryNode[]
    const ancestors =
      findCategoryNodePath(topLevel, selectedBottomLevelCategory.id) ?? []
    return [
      ...ancestors.map((category) => category.description),
      selectedBottomLevelCategory.description,
    ].filter((description): description is string => Boolean(description))
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.topLevel,
    selectedBottomLevelCategory,
  ])

  const [resultsContainer, setResultsContainer] =
    useState<HTMLDivElement | null>(null)

  const unitsResponse = useQuery(GET_CUSTOMS_CALCULATOR_UNITS, {
    variables: { tariffNumber: selectedBottomLevelCategory?.tariffNumber },
    skip: !selectedBottomLevelCategory?.tariffNumber,
  })

  if (productCategoriesResponse.error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(translationStrings.categoriesErrorTitle)}
        message={formatMessage(translationStrings.categoriesErrorMessage)}
      />
    )
  }

  return (
    <div>
      <Box background="blue100" padding={[3, 3, 6]}>
        <Stack space={6}>
          {shortcuts.length > 0 && (
            <Stack space={3}>
              <Text variant="h5">
                {formatMessage(translationStrings.shortcutsTitle)}
              </Text>
              <Inline space={1}>
                {shortcuts.map((shortcut) => (
                  <Tag
                    key={shortcut.value}
                    variant="darkerBlue"
                    onClick={() => {
                      setInputState({
                        ...inputState,
                        searchInput: shortcut.label,
                      })
                      const bottomLevelCategory =
                        productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
                          (category) => category.id === shortcut.value,
                        )
                      if (bottomLevelCategory)
                        setSelectedBottomLevelCategory(bottomLevelCategory)
                      else setSelectedBottomLevelCategory(null)

                      const topLevel =
                        productCategoriesResponse.data
                          ?.customsCalculatorProductCategories?.topLevel ?? []
                      const path =
                        findCategoryPath(
                          topLevel as CategoryNode[],
                          bottomLevelCategory?.id ?? '',
                        ) ?? []
                      setSelectedCategory({
                        current: path.length > 0 ? path[path.length - 1] : null,
                        breadcrumbs: path.slice(0, -1),
                      })
                    }}
                  >
                    {shortcut.label}
                  </Tag>
                ))}
              </Inline>
            </Stack>
          )}

          <Stack space={3}>
            <Text variant="h5">
              {formatMessage(translationStrings.productSearchInputLabel)}
            </Text>

            <AsyncSearch
              options={searchOptions}
              filter={(option) =>
                option.label.toLowerCase().includes(normalizedSearchInput) ||
                (keywordsByCategoryId.get(option.value) ?? []).some((keyword) =>
                  keyword.includes(normalizedSearchInput),
                )
              }
              size="large"
              placeholder={formatMessage(
                translationStrings.productSearchInputPlaceholder,
              )}
              inputValue={inputState.searchInput}
              clearAriaLabel={formatMessage(
                translationStrings.clearProductSearchInputLabel,
              )}
              onClear={() => {
                setInputState({ ...inputState, searchInput: '' })
                setSelectedBottomLevelCategory(null)
                setSelectedCategory({ current: null, breadcrumbs: [] })
              }}
              onInputValueChange={(value) => {
                setInputState({ ...inputState, searchInput: value })
                if (!value) {
                  setSelectedBottomLevelCategory(null)
                  return
                }
                // Multiple categories can share a display label (e.g. "Annað").
                // Matching free-typed text by label alone would silently bind the
                // wrong tariff, so only auto-select when the label is unambiguous;
                // otherwise force an explicit pick (onChange resolves by id).
                const matches =
                  productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.filter(
                    (category) => category.label === value,
                  ) ?? []
                setSelectedBottomLevelCategory(
                  matches.length === 1 ? matches[0] : null,
                )
              }}
              onChange={(option) => {
                setInputState({
                  ...inputState,
                  searchInput: option?.label ?? '',
                })
                const bottomLevelCategory =
                  productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
                    (category) => category.id === option?.value,
                  )
                if (bottomLevelCategory) {
                  setSelectedBottomLevelCategory(bottomLevelCategory)
                  const topLevel =
                    productCategoriesResponse.data
                      ?.customsCalculatorProductCategories?.topLevel ?? []
                  const path =
                    findCategoryPath(
                      topLevel as CategoryNode[],
                      bottomLevelCategory.id,
                    ) ?? []
                  setSelectedCategory({
                    current: path.length > 0 ? path[path.length - 1] : null,
                    breadcrumbs: path.slice(0, -1),
                  })
                }
              }}
            />

            <CategoryModal
              title={formatMessage(translationStrings.searchForCategory)}
              onOptionSelect={(option) => {
                if (!option.hasChildren) {
                  const bottomLevelCategory =
                    productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
                      (category) => category.id === option.value,
                    )
                  if (bottomLevelCategory) {
                    setSelectedBottomLevelCategory(bottomLevelCategory)
                    setInputState({
                      ...inputState,
                      searchInput: bottomLevelCategory.label,
                    })
                  }
                  return
                }
                setSelectedCategory((prev) => {
                  const updatedBreadcrumbs = [...prev.breadcrumbs]
                  if (prev.current) updatedBreadcrumbs.push(prev.current)
                  return {
                    current: option,
                    breadcrumbs: updatedBreadcrumbs,
                  }
                })
              }}
              options={categoryOptions}
              topComponent={
                !!selectedCategory.current?.label && (
                  <Box
                    background="purple100"
                    paddingX={1}
                    paddingY={2}
                    tabIndex={0}
                    display="flex"
                    justifyContent="flexStart"
                    alignItems="center"
                    columnGap={1}
                    role="button"
                    cursor="pointer"
                    onClick={() =>
                      setSelectedCategory((prev) => {
                        if (prev.breadcrumbs.length > 0)
                          return {
                            current:
                              prev.breadcrumbs[prev.breadcrumbs.length - 1],
                            breadcrumbs: prev.breadcrumbs.slice(0, -1),
                          }
                        return { current: null, breadcrumbs: [] }
                      })
                    }
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault()
                        setSelectedCategory((prev) => {
                          if (prev.breadcrumbs.length > 0)
                            return {
                              current:
                                prev.breadcrumbs[prev.breadcrumbs.length - 1],
                              breadcrumbs: prev.breadcrumbs.slice(0, -1),
                            }
                          return { current: null, breadcrumbs: [] }
                        })
                      }
                    }}
                  >
                    <Icon icon="chevronBack" color="blue400" size="medium" />
                    <Text variant="h5">{selectedCategory.current.label}</Text>
                  </Box>
                )
              }
            />

            {categoryDescriptions.length > 0 && (
              <Text variant="small" as="div">
                <ul className={styles.descriptionList}>
                  {categoryDescriptions.map((description, index) => (
                    <li key={index}>
                      <span
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </li>
                  ))}
                </ul>
              </Text>
            )}
          </Stack>

          {Boolean(unitsResponse.data?.customsCalculatorUnits?.units) && (
            <Units
              key={selectedBottomLevelCategory?.tariffNumber ?? ''}
              unitStrings={
                unitsResponse.data?.customsCalculatorUnits?.units ?? []
              }
              currencyOptions={currencyOptions}
              tariffNumber={selectedBottomLevelCategory?.tariffNumber ?? ''}
              allowCalculation={!!selectedBottomLevelCategory}
              resultsContainer={resultsContainer}
            />
          )}
        </Stack>
      </Box>
      <div ref={setResultsContainer} />
    </div>
  )
}

export default CustomsCalculator
