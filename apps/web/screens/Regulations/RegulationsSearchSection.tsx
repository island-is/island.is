import React, { FC, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SubpageMainContent } from '@island.is/web/components'
import {
  CategoryCard,
  Checkbox,
  Filter,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { NamespaceGetter } from '@island.is/web/hooks'
import { NoChildren } from '@island.is/web/types'
import { LawChapter, Ministry, SearchTexts } from './mockData'
import { OptionTypeBase, ValueType } from 'react-select'
import { nameToSlug, useRegulationLinkResolver } from './regulationUtils'

// ---------------------------------------------------------------------------

/** Icky utility function to handle the buggy typing of react-select
 *
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
 */
const getRSValue = (option: ValueType<OptionTypeBase>) => {
  const opt: OptionTypeBase | undefined | null = Array.isArray(option)
    ? (option as Array<OptionTypeBase>)[0]
    : option
  return opt ? opt.value : undefined
}

const emptyOption = (label?: string): Option => ({
  value: '',
  label: label != null ? `– ${label} –` : '—',
})

/** Looks through a list of `Option`s for one with a matching
 * `value` and returns a copy of it with its label trimmed for nicer
 * display by `react-select`
 *
 * If a match is not found it returns `null` because that's the
 * magic value that tricks `react-select` to show the "placeholder" value
 */
const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
): Option | null => {
  if (!value) {
    return null
  }
  const opt = options.find((opt) => opt.value === value)
  return (
    (opt && {
      value: opt.value,
      label: opt.label.trim(),
    }) ||
    null
  )
}

const isLegacyMinistry = (
  ministries: ReadonlyArray<Ministry>,
  shortCode: string,
) => {
  const ministry = ministries.find((m) => m.shortCode === shortCode)
  return !!(ministry && ministry.legacy)
}

const yearToOption = (year: number | string): Option => {
  const value = String(year)
  return {
    value,
    label: value,
  }
}

const filterOrder: Record<RegulationSearchKeys, number> = {
  q: 1,
  year: 2,
  rn: 3,
  ch: 4,
  all: 5,
}

/** Returns a copy of the original query with any falsy values filtered out  */
const cleanQuery = (
  query: Record<RegulationSearchKeys, string | null | undefined>,
) =>
  Object.entries(query)
    .sort((a, b) => {
      const keyA = a[0] as RegulationSearchKeys
      const keyB = b[0] as RegulationSearchKeys
      return (filterOrder[keyA] || 999) > (filterOrder[keyB] || 999) ? 1 : -1
    })
    .reduce<Record<string, string>>((newQuery, [key, value]) => {
      if (value) {
        newQuery[key] = value
      }
      return newQuery
    }, {})

export type RegulationSearchKeys = 'q' | 'rn' | 'year' | 'ch' | 'all'
export type RegulationSearchFilters = Record<RegulationSearchKeys, string>

// ---------------------------------------------------------------------------

export type RegulationsSearchSectionProps = {
  searchResults: ReadonlyArray<{
    name: string
    title: string
    ministry?: { name: string; shortCode: string }
  }>
  searchFilters: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: ReadonlyArray<Ministry>
  lawcCapters: ReadonlyArray<LawChapter>
  getText: NamespaceGetter<SearchTexts>
} & NoChildren

export const RegulationsSearchSection: FC<RegulationsSearchSectionProps> = (
  props,
) => {
  const filters = props.searchFilters
  const txt = props.getText

  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()
  const router = useRouter()

  const activeFilters = useMemo(
    () => Object.values(filters).some((value) => !!value),
    [filters],
  )

  const yearOptions = useMemo(() => {
    return [emptyOption(txt('searchFieldYearEmptyOption'))].concat(
      props.years.map(yearToOption),
    ) as ReadonlyArray<Option>
  }, [props.years])

  const ministryOptions = useMemo(() => {
    return [emptyOption(txt('searchFieldMinistryEmptyOption'))].concat(
      props.ministries
        .slice(0)
        // move
        .sort((a, b) =>
          a.legacy === b.legacy ? 0 : a.legacy && !b.legacy ? 1 : -1,
        )
        .map(
          (m): Option => ({
            value: m.shortCode,
            label:
              m.name +
              (m.legacy ? ` ${txt('searchFieldLegacyMinistrySuffix')}` : ''),
          }),
        ),
    ) as ReadonlyArray<Option>
  }, [props.ministries])

  const lawChapterOptions = useMemo(
    () =>
      props.lawcCapters.reduce<Array<Option>>(
        (opts, { name, numberCode, subChapters }) => {
          opts.push({
            value: numberCode,
            label: `${Number(numberCode)}. ${name}`,
          })
          opts = opts.concat(
            subChapters.map(({ name, numberCode }) => ({
              value: numberCode,
              label: `    ${name}`,
            })),
          )
          return opts
        },
        [emptyOption(txt('searchFieldChapterEmptyOption'))],
      ) as ReadonlyArray<Option>,
    [props.lawcCapters],
  )

  const doSearch = (key: RegulationSearchKeys, value: string) => {
    router.replace({
      query: cleanQuery({
        ...props.searchFilters,
        [key]: value || undefined,
      }),
    })
  }
  const clearSearch = () => {
    router.replace({
      query: null,
    })
  }

  return (
    <SidebarLayout
      paddingTop={6}
      fullWidthContent="right"
      sidebarContent={
        <Filter
          labelClear={txt('searchClearLabel')}
          labelOpen={txt('searchOpenLabel')}
          labelClose={txt('searchCloseLabel')}
          labelResult={txt('searchResultLabel')}
          labelTitle={txt('searchTitleLabel')}
          onFilterClear={clearSearch}
        >
          <FilterInput
            name="q"
            placeholder={txt('searchFieldQueryLabel')}
            value={filters.q}
            onChange={(value) => doSearch('q', value)}
          />
          <Select
            name="year"
            isSearchable
            label={txt('searchFieldYearLabel')}
            placeholder={txt('searchFieldYearPlaceholder')}
            value={findValueOption(yearOptions, filters.year)}
            options={yearOptions}
            onChange={(option) => doSearch('year', getRSValue(option) || '')}
            size="sm"
          />
          <Select
            name="ch"
            isSearchable
            label={txt('searchFieldChapterLabel')}
            placeholder={txt('searchFieldChapterPlaceholder')}
            value={findValueOption(lawChapterOptions, filters.ch)}
            options={lawChapterOptions}
            onChange={(option) => doSearch('ch', getRSValue(option) || '')}
            size="sm"
          />
          <Select
            name="rn"
            isSearchable
            label={txt('searchFieldMinistryLabel')}
            placeholder={txt('searchFieldMinistryPlaceholder')}
            value={findValueOption(ministryOptions, filters.rn)}
            options={ministryOptions}
            onChange={(option) => doSearch('rn', getRSValue(option) || '')}
            size="sm"
          />
          <Checkbox
            label={txt('searchFieldIncludeAmendingLabel')}
            checked={!!filters.all}
            onChange={() => doSearch('all', !filters.all ? 'y' : '')}
          />
        </Filter>
      }
    >
      <SubpageMainContent
        main={
          <>
            <Text variant="h2" as="h2" marginBottom={3}>
              {activeFilters
                ? txt('searchResultsLegend')
                : txt('defaultRegulationsLegend')}
            </Text>

            <GridContainer>
              <GridRow>
                {props.searchResults.map((reg, i) => (
                  <GridColumn
                    key={reg.name}
                    span={['1/1', '1/1', '1/2']}
                    paddingBottom={4}
                  >
                    <CategoryCard
                      href={linkToRegulation(reg.name)}
                      heading={reg.name}
                      text={reg.title}
                      tags={
                        reg.ministry && [
                          { label: reg.ministry.name, disabled: true },
                        ]
                      }
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </>
        }
      />
    </SidebarLayout>
  )
}
