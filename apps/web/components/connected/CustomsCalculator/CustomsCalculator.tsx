import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
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
  children?: CategoryNode[]
}

const findCategoryPath = (
  categories: CategoryNode[],
  targetId: string,
  path: { label: string; value: string }[] = [],
): { label: string; value: string }[] | null => {
  for (const category of categories) {
    if (category.id === targetId) return path
    if (category.children?.length) {
      const result = findCategoryPath(category.children, targetId, [
        ...path,
        { label: category.label, value: category.id },
      ])
      if (result !== null) return result
    }
  }
  return null
}

interface CustomsCalculatorProps {
  slice: ConnectedComponent
}

const CustomsCalculator = ({ slice }: CustomsCalculatorProps) => {
  const { formatMessage } = useIntl()

  const currencyOptions = useMemo<StringOption[]>(() => {
    return [
      { label: 'ISK', value: 'ISK', description: 'Íslensk króna' },
      { label: 'AUD', value: 'AUD', description: 'Ástralíudalur' },
      { label: 'CAD', value: 'CAD', description: 'Kanadadalur' },
      { label: 'CHF', value: 'CHF', description: 'Svissneskur franki' },
      { label: 'DKK', value: 'DKK', description: 'Dönsk króna' },
      { label: 'EUR', value: 'EUR', description: 'Evra' },
      { label: 'GBP', value: 'GBP', description: 'Sterlingspund' },
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
      { label: 'USD', value: 'USD', description: 'Bandaríkjadalur' },
    ]
  }, [])

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
            </Stack>
          </Box>
        ),
      })
    }
    return options
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

  const unitsResponse = useQuery(GET_CUSTOMS_CALCULATOR_UNITS, {
    variables: { tariffNumber: selectedBottomLevelCategory?.tariffNumber },
    skip: !selectedBottomLevelCategory?.tariffNumber,
  })

  return (
    <Stack space={3}>
      {shortcuts.length > 0 && (
        <Stack space={2}>
          <Text variant="h5">
            {formatMessage(translationStrings.shortcutsTitle)}
          </Text>
          <Inline space={1}>
            {shortcuts.map((shortcut) => (
              <Tag
                key={shortcut.value}
                onClick={() => {
                  setInputState({ ...inputState, searchInput: shortcut.label })
                  const bottomLevelCategory =
                    productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
                      (category) => category.id === shortcut.value,
                    )
                  if (bottomLevelCategory)
                    setSelectedBottomLevelCategory(bottomLevelCategory)
                  else setSelectedBottomLevelCategory(null)
                }}
              >
                {shortcut.label}
              </Tag>
            ))}
          </Inline>
        </Stack>
      )}

      <Stack space={1}>
        <Text variant="h5">
          {formatMessage(translationStrings.productSearchInputLabel)}
        </Text>

        <AsyncSearch
          options={searchOptions}
          filter={(option) =>
            option.label
              .toLowerCase()
              .includes(inputState.searchInput.replace('´', '').toLowerCase())
          }
          size="large"
          placeholder={formatMessage(
            translationStrings.productSearchInputPlaceholder,
          )}
          colored={true}
          inputValue={inputState.searchInput}
          onInputValueChange={(value) => {
            setInputState({ ...inputState, searchInput: value })
            if (!value) setSelectedBottomLevelCategory(null)
            else {
              const bottomLevelCategory =
                productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
                  (category) => category.label === value,
                )
              if (bottomLevelCategory)
                setSelectedBottomLevelCategory(bottomLevelCategory)
              else setSelectedBottomLevelCategory(null)
            }
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
        <Box paddingX={1}>
          <Text variant="small">
            <span
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: selectedBottomLevelCategory?.description ?? '',
              }}
            />
          </Text>
        </Box>
      </Stack>

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
                      current: prev.breadcrumbs[prev.breadcrumbs.length - 1],
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
                        current: prev.breadcrumbs[prev.breadcrumbs.length - 1],
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

      {Boolean(unitsResponse.data?.customsCalculatorUnits?.units) && (
        <Units
          key={selectedBottomLevelCategory?.tariffNumber ?? ''}
          unitStrings={unitsResponse.data?.customsCalculatorUnits?.units ?? []}
          currencyOptions={currencyOptions}
          tariffNumber={selectedBottomLevelCategory?.tariffNumber ?? ''}
          allowCalculation={!!selectedBottomLevelCategory}
        />
      )}
    </Stack>
  )
}

export default CustomsCalculator
