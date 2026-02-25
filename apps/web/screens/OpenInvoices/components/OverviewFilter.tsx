import { useIntl } from 'react-intl'

import {
  Box,
  Checkbox,
  Divider,
  Filter,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { m } from '../messages'
import { FilterDateAccordion } from './FilterDateAccordion'
import { FilterSelectAccordion } from './FilterSelectAccordion'

export type SearchState = Record<string, Array<string> | undefined>

interface MultiSelectProps {
  type: 'multi'
  sections: Array<{
    id: string
    label: string
    items: Array<{
      value: string
      label: string
    }>
  }>
}

interface DateSelectProps {
  type: 'date'
  id: string
  label: string
  placeholder: string
  valueFrom: Date
  valueTo: Date
}

interface CheckboxProps {
  type: 'checkbox'
  id: string
  label: string
  checked?: boolean
}

interface SelectProps {
  type: 'select'
  id: string
  label: string
  placeholder: string
  items: Array<{
    value: string
    label: string
  }>
}

interface Props {
  onSearchUpdate: (
    categoryId: keyof SearchState,
    values?: Array<string>,
  ) => void
  onReset: () => void
  searchState?: SearchState
  url: string
  locale: Locale
  categories: Array<
    MultiSelectProps | DateSelectProps | CheckboxProps | SelectProps
  >
  variant?: FilterProps['variant']
  hits?: number
}

export const OverviewFilter = ({
  onSearchUpdate,
  onReset,
  searchState,
  categories,
  locale,
  url,
  variant = 'default',
  hits,
}: Props) => {
  const { formatMessage } = useIntl()
  return (
    <Box
      component="form"
      borderRadius="large"
      action={url}
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <Filter
        labelClearAll={formatMessage(m.search.clearFilters)}
        labelOpen={formatMessage(m.search.openFilter)}
        labelClose={formatMessage(m.search.closeFilter)}
        labelClear={formatMessage(m.search.clearFilters)}
        labelTitle={formatMessage(m.search.filterTitle)}
        labelResult={formatMessage(m.search.viewResults)}
        resultCount={hits}
        onFilterClear={onReset}
        variant={variant}
        align={'right'}
      >
        <Box background="white" borderRadius="large">
          {categories.map((category, index) => {
            const divider =
              index > 0 ? (
                <Box paddingX={3}>
                  <Divider />
                </Box>
              ) : null

            if (category.type === 'checkbox') {
              const searchStateValue = searchState?.[category.id]?.[0]
              return (
                <>
                  {divider}
                  <Box
                    paddingX={3}
                    paddingY={3}
                    borderRadius="large"
                    background="white"
                  >
                    <Checkbox
                      key={category.id}
                      name={category.id}
                      label={category.label}
                      checked={searchStateValue === 'true'}
                      onChange={(event) =>
                        onSearchUpdate(
                          category.id as keyof SearchState,
                          event.target.checked ? ['true'] : ['false'],
                        )
                      }
                    />
                  </Box>
                </>
              )
            }
            if (category.type === 'date') {
              return (
                <>
                  {divider}
                  <FilterDateAccordion
                    title={formatMessage(m.search.range)}
                    id={category.id}
                    locale={locale}
                    valueFrom={category.valueFrom}
                    valueTo={category.valueTo}
                    placeholder={category.placeholder}
                    onChange={(valueFrom, valueTo) => {
                      const valueFromString = valueFrom
                        ? valueFrom.toISOString()
                        : undefined
                      const valueToString = valueTo
                        ? valueTo.toISOString()
                        : undefined
                      onSearchUpdate(
                        category.id as keyof SearchState,
                        [valueFromString, valueToString].filter(isDefined),
                      )
                    }}
                  />
                </>
              )
            }

            if (category.type === 'select') {
              const selectedValue = searchState?.[category.id]?.[0]
              return (
                <>
                  {divider}
                  <FilterSelectAccordion
                    key={category.id}
                    id={category.id}
                    title={category.label}
                    placeholder={category.placeholder}
                    items={category.items}
                    value={selectedValue}
                    onChange={(value) =>
                      onSearchUpdate(
                        category.id as keyof SearchState,
                        value ? [value] : undefined,
                      )
                    }
                  />
                </>
              )
            }

            return (
              <>
                {divider}
                <FilterMultiChoice
                  labelClear={formatMessage(m.search.clearFilterCategory)}
                  onChange={({ categoryId, selected }) => {
                    onSearchUpdate(
                      categoryId as keyof SearchState,
                      selected.length ? selected : undefined,
                    )
                  }}
                  onClear={(categoryId) => {
                    onSearchUpdate(categoryId as keyof SearchState, undefined)
                  }}
                  categories={category.sections.map((section) => ({
                    id: section.id,
                    label: section.label,
                    selected: searchState?.[section.id] ?? [],
                    filters: section.items.map((item) => ({
                      value: item.value,
                      label: item.label,
                    })),
                  }))}
                />
              </>
            )
          })}
        </Box>
      </Filter>
    </Box>
  )
}
