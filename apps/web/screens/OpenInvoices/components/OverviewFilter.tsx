import { useIntl } from 'react-intl'

import {
  Box,
  Checkbox,
  Divider,
  Filter,
  FilterProps,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { m } from '../messages'
import { FilterDateAccordion } from './FilterDateAccordion'
import { FilterSearchAccordion } from './FilterSearchAccordion'

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
              return (
                <>
                  {divider}
                  <FilterSearchAccordion
                    key={category.id}
                    id={category.id}
                    title={category.label}
                    items={category.items}
                    selected={searchState?.[category.id] ?? []}
                    showOptionsWhenEmpty={false}
                    initiallyExpanded={
                      (searchState?.[category.id] ?? []).length > 0
                    }
                    onChange={(values) =>
                      onSearchUpdate(
                        category.id as keyof SearchState,
                        values.length ? values : undefined,
                      )
                    }
                  />
                </>
              )
            }

            return (
              <>
                {divider}
                {category.sections.map((section, sectionIndex) => (
                  <>
                    {sectionIndex > 0 && (
                      <Box paddingX={3}>
                        <Divider />
                      </Box>
                    )}
                    <FilterSearchAccordion
                      key={section.id}
                      id={section.id}
                      title={section.label}
                      items={section.items}
                      selected={searchState?.[section.id] ?? []}
                      initiallyExpanded={
                        (searchState?.[section.id] ?? []).length > 0
                      }
                      onChange={(values) =>
                        onSearchUpdate(
                          section.id as keyof SearchState,
                          values.length ? values : undefined,
                        )
                      }
                    />
                  </>
                ))}
              </>
            )
          })}
        </Box>
      </Filter>
    </Box>
  )
}
