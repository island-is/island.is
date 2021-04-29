import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Filter,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import {
  RegulationLawChapterTree,
  RegulationMinistry,
} from './Regulations.types'
import { RegulationHomeTexts } from './RegulationTexts.types'
import { OptionTypeBase, ValueType } from 'react-select'
import {
  RegulationSearchFilters,
  RegulationSearchKeys,
} from './regulationUtils'

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
  ministries: ReadonlyArray<RegulationMinistry>,
  slug: string,
) => {
  const ministry = ministries.find((m) => m.slug === slug)
  return !!(ministry && !ministry.current)
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

// ---------------------------------------------------------------------------

export type RegulationsSearchSectionProps = {
  searchFilters: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: ReadonlyArray<RegulationMinistry>
  lawChapters: Readonly<RegulationLawChapterTree>
  texts: RegulationHomeTexts
}

export const RegulationsSearchSection = (
  props: RegulationsSearchSectionProps,
) => {
  const filters = props.searchFilters
  const txt = useNamespace(props.texts)
  const router = useRouter()

  const yearOptions = useMemo(() => {
    return [emptyOption(txt('searchYearEmptyOption'))].concat(
      props.years.map(yearToOption),
    ) as ReadonlyArray<Option>
  }, [props.years])

  const ministryOptions = useMemo(() => {
    return [emptyOption(txt('searchMinistryEmptyOption'))].concat(
      props.ministries.map(
        (m): Option => ({
          value: m.slug,
          label:
            m.name + (m.current ? '' : ` ${txt('searchLegacyMinistrySuffix')}`),
        }),
      ),
    ) as ReadonlyArray<Option>
  }, [props.ministries])

  const lawChapterOptions = useMemo(
    () =>
      props.lawChapters.reduce<Array<Option>>(
        (opts, { name, slug, subChapters }) => {
          opts.push({
            value: slug,
            label: `${name}`,
          })
          opts = opts.concat(
            subChapters.map(({ name, slug }) => ({
              value: slug,
              label: `    ${name}`,
            })),
          )
          return opts
        },
        [emptyOption(txt('searchChapterEmptyOption'))],
      ) as ReadonlyArray<Option>,
    [props.lawChapters],
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

  const [filterValue, setFilterValue] = useState(filters.q)
  const textFilter = (q: string) => {
    setFilterValue(q)
  }

  return (
    <Filter
      labelClear={txt('searchClearLabel')}
      labelOpen={txt('searchOpenLabel')}
      labelClose={txt('searchCloseLabel')}
      labelResult={txt('searchResultLabel')}
      labelTitle={txt('searchTitleLabel')}
      onFilterClear={clearSearch}
    >
      <GridContainer>
        <GridRow alignItems="center">
          <GridColumn
            span={['1/1', '1/1', '12/12', '11/12', '8/12']}
            offset={['0', '0', '0', '0', '1/12']}
            paddingTop={0}
            paddingBottom={[2, 2, 0]}
          >
            <Input
              id="q"
              name="q"
              placeholder={txt('searchQueryLabel')}
              backgroundColor={['blue', 'blue', 'white']}
              size="md"
              icon="search"
              iconType="outline"
              value={filterValue}
              onChange={(event) => textFilter(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  doSearch('q', filterValue)
                }
              }}
              onBlur={() => doSearch('q', filterValue)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['1/1', '1/1', '4/12', '3/12', '2/12']}
            offset={['0', '0', '0', '0', '1/12']}
            paddingTop={[0, 0, 4]}
            paddingBottom={[2, 2, 0]}
          >
            <Select
              name="year"
              isSearchable
              label={txt('searchYearLabel')}
              placeholder={txt('searchYearPlaceholder')}
              value={findValueOption(yearOptions, filters.year)}
              options={yearOptions}
              onChange={(option) => doSearch('year', getRSValue(option) || '')}
              size="sm"
            />
          </GridColumn>
          <GridColumn
            span={['1/1', '1/1', '4/12', '4/12', '3/12']}
            paddingTop={[0, 0, 4]}
            paddingBottom={[2, 2, 0]}
          >
            <Select
              name="ch"
              isSearchable
              label={txt('searchChapterLabel')}
              placeholder={txt('searchChapterPlaceholder')}
              value={findValueOption(lawChapterOptions, filters.ch)}
              options={lawChapterOptions}
              onChange={(option) => doSearch('ch', getRSValue(option) || '')}
              size="sm"
            />
          </GridColumn>
          <GridColumn
            span={['1/1', '1/1', '4/12', '4/12', '3/12']}
            paddingTop={[0, 0, 4]}
            paddingBottom={[2, 2, 0]}
          >
            <Select
              name="rn"
              isSearchable
              label={txt('searchMinistryLabel')}
              placeholder={txt('searchMinistryPlaceholder')}
              value={findValueOption(ministryOptions, filters.rn)}
              options={ministryOptions}
              onChange={(option) => doSearch('rn', getRSValue(option) || '')}
              size="sm"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>

      {/*
      // TODO: awaiting feedback from client
      <Checkbox
        id="regulations-search-amendments-checkbox"
        label={txt('searchIncludeAmendingLabel')}
        checked={!!filters.all}
        onChange={() => doSearch('all', !filters.all ? 'y' : '')}
      />*/}
    </Filter>
  )
}
