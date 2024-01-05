import * as s from './RegulationsSearchSection.css'

import React, { useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import { SingleValue } from 'react-select'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  StringOption as Option,
  Select,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useShortState, LawChapterTree, Ministry } from '@island.is/regulations'
import { RegulationHomeTexts } from './RegulationTexts.types'
import { RegulationSearchFilters, RegulationSearchKey } from './regulationUtils'
import cn from 'classnames'

// ---------------------------------------------------------------------------

/** Icky utility function to handle the buggy typing of react-select
 *
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
 */
const getRSValue = (option: SingleValue<Option>) => {
  const opt: Option | undefined | null = Array.isArray(option)
    ? (option as Array<Option>)[0]
    : option
  return opt ? String(opt.value) : undefined
}

const emptyOption = (label?: string): Option => ({
  value: '',
  label: label ? `– ${label} –` : '—',
})

/** Looks through a list of `Option`s for one with a matching `value`
 *
 * If a match is not found it returns `null` because that's the
 * magic value that tricks `react-select` to show the "placeholder" value
 */
const findValueOption = (options: ReadonlyArray<Option>, value?: string) => {
  // NOTE: The returned option MUST NOT be a copy (with trimmed value,
  // even if it would look nicer) because react-select seems to do an
  // internal `===` comparison against the options list, and thus copies
  // will fail to appear selected in the dropdown list.
  return (value && options.find((opt) => opt.value === value)) || null
}

const yearToOption = (year: number | string): Option => {
  const value = String(year)
  return {
    value,
    label: value,
  }
}

const filterOrder: Record<RegulationSearchKey, number> = {
  q: 1,
  year: 2,
  yearTo: 3,
  rn: 4,
  ch: 5,
  iA: 6,
  iR: 7,
  page: 8,
}

/** Returns a copy of the original query with any falsy values filtered out  */
const cleanQuery = (
  query: Record<RegulationSearchKey, string | null | undefined>,
) =>
  Object.entries(query)
    .sort((a, b) => {
      const keyA = a[0] as RegulationSearchKey
      const keyB = b[0] as RegulationSearchKey
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
  ministries: ReadonlyArray<Ministry>
  lawChapters: Readonly<LawChapterTree>
  texts: RegulationHomeTexts
  page?: number
  anchorRef: React.RefObject<HTMLDivElement>
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

  const [yearToOptions, setYearToOptions] = useState(yearOptions)
  useEffect(() => {
    if (filters.year) {
      setYearToOptions(
        yearOptions.filter((opt) => {
          return opt.value === '' || Number(opt.value) > Number(filters.year)
        }),
      )
    } else {
      setYearToOptions(yearOptions)
    }

    if (Number(filters.yearTo) <= Number(filters.year)) {
      doSearch('yearTo', '')
    }
  }, [yearOptions, filters.year])

  useEffect(() => {
    doSearch('page', props.page && props.page > 1 ? String(props.page) : '')
    const anchorTop =
      (props?.anchorRef?.current?.getBoundingClientRect()?.top || 0) +
      window.scrollY
    setTimeout(() => {
      window.scrollTo({
        top: props.page && props.page > 1 ? anchorTop - 30 : 0,
        behavior: 'smooth',
      })
    }, 100)
  }, [props.page])

  const ministryOptions = useMemo(() => {
    return [emptyOption(txt('searchMinistryEmptyOption'))].concat(
      props.ministries.map(
        (m): Option => ({
          value: m.slug,
          label: m.name,
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
              label: '    ' + name,
            })),
          )
          return opts
        },
        [emptyOption(txt('searchChapterEmptyOption'))],
      ) as ReadonlyArray<Option>,
    [props.lawChapters],
  )

  const doSearch = (
    keyOrFilters: RegulationSearchKey | Partial<RegulationSearchFilters>,
    value?: string,
  ) => {
    let newFilters =
      typeof keyOrFilters !== 'string'
        ? { ...filters, ...keyOrFilters }
        : { ...filters, [keyOrFilters]: value }

    // reset page to 1 if any search params change
    if (keyOrFilters !== 'page') {
      newFilters = { ...newFilters, page: '' }
    }
    router.replace({
      pathname: router.pathname,
      query: cleanQuery(newFilters),
    })
  }

  const clearSearch = () => {
    setFilterValue('')
    router.replace({
      pathname: router.pathname,
      query: null,
    })
  }

  const clearAdvancedFields = () => {
    router.replace({
      pathname: router.pathname,
      query: filterValue ? { q: filterValue } : undefined,
    })
  }

  const [filterValue, setFilterValue] = useState(filters.q)
  useEffect(() => {
    setFilterValue(filters.q)
  }, [filters.q])

  const hasAdvancedValues = !!(
    filters.year ||
    filters.rn ||
    filters.ch ||
    filters.iA ||
    filters.iR
  )
  const filterHasValues = !!filterValue || hasAdvancedValues

  const [showAdvancedSearch, setShowAdvancedSearch] =
    useState(hasAdvancedValues)
  const [advancedSearchTransitioning, setAdvancedSearchTransitioning] =
    useShortState<boolean>(undefined, 600)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['1/1', '1/1', '1/1', '1/1', '10/12']}
          offset={['0', '0', '0', '0', '1/12']}
          paddingTop={2}
          paddingBottom={[4, 4, 4]}
        >
          <GridContainer>
            <GridRow alignItems="center">
              <GridColumn
                span={['1/1', '1/1', '10/12', '10/12', '8/10']}
                paddingTop={0}
                paddingBottom={[2, 2, 0]}
              >
                <Input
                  id="q"
                  name="q"
                  placeholder={txt('searchQueryLabel')}
                  backgroundColor={['blue', 'blue', 'white']}
                  size="md"
                  icon={{ name: 'search', type: 'outline' }}
                  value={filterValue}
                  onChange={(event) => setFilterValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      doSearch('q', filterValue)
                    }
                  }}
                  onBlur={() => doSearch('q', filterValue)}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/1', '2/12', '2/12', '2/10']}
                paddingBottom={[2, 2, 0]}
              >
                <Button
                  variant="text"
                  icon={showAdvancedSearch ? 'chevronUp' : 'chevronDown'}
                  onClick={() => {
                    if (hasAdvancedValues) {
                      clearAdvancedFields()
                    }
                    setShowAdvancedSearch(!showAdvancedSearch)
                    setAdvancedSearchTransitioning(true)
                  }}
                >
                  Ítarleit
                </Button>
              </GridColumn>
            </GridRow>

            <div
              className={cn(
                s.advancedFields,
                advancedSearchTransitioning && s.advancedFieldsTransitioning,
              )}
              hidden={!showAdvancedSearch}
            >
              {(showAdvancedSearch || advancedSearchTransitioning) && (
                <>
                  <GridRow>
                    <GridColumn
                      span={['1/1', '1/1', '6/12', '5/12', '4/10']}
                      paddingTop={[0, 0, 3]}
                      paddingBottom={[2, 2, 0]}
                    >
                      <Checkbox
                        id="regulations-search-amendments-checkbox"
                        label={txt(
                          'searchIncludeAmendingLabel',
                          'Leita í breytingareglugerðum',
                        )}
                        checked={!!filters.iA}
                        onChange={() =>
                          doSearch('iA', !filters.iA ? 'true' : '')
                        }
                      />
                    </GridColumn>
                    <GridColumn
                      span={['1/1', '1/1', '6/12', '5/12', '4/10']}
                      paddingTop={[0, 0, 3]}
                      paddingBottom={[2, 2, 0]}
                    >
                      <Checkbox
                        id="regulations-search-repelled-checkbox"
                        label={txt(
                          'searchIncludeRepelledLabel',
                          'Leita í brottföllnum reglugerðum',
                        )}
                        checked={!!filters.iR}
                        onChange={() =>
                          doSearch({
                            iR: !filters.iR ? 'true' : '',
                            rn: undefined,
                          })
                        }
                      />
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn
                      span={['1/1', '1/1', '6/12', '5/12', '4/10']}
                      paddingTop={[0, 0, 4]}
                      paddingBottom={[2, 2, 0]}
                    >
                      <Select
                        name="rn"
                        isSearchable
                        label={txt('searchMinistryLabel', 'Ráðuneyti')}
                        placeholder={txt(
                          'searchMinistryPlaceholder',
                          'Veldu ráðuneyti',
                        )}
                        value={findValueOption(ministryOptions, filters.rn)}
                        options={ministryOptions}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        onChange={(option) =>
                          doSearch({ rn: getRSValue(option), iR: undefined })
                        }
                        size="sm"
                      />
                    </GridColumn>
                    <GridColumn
                      span={['1/1', '1/1', '6/12', '5/12', '4/10']}
                      paddingTop={[0, 0, 4]}
                      paddingBottom={[2, 2, 0]}
                    >
                      <Select
                        name="ch"
                        isSearchable
                        label={txt('searchChapterLabel', 'Kafli í lagasafni')}
                        placeholder={txt(
                          'searchChapterPlaceholder',
                          'Veldu kafla',
                        )}
                        value={findValueOption(lawChapterOptions, filters.ch)}
                        options={lawChapterOptions}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        onChange={(option) =>
                          doSearch('ch', getRSValue(option))
                        }
                        size="sm"
                      />
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn
                      span={['1/1', '1/1', '4/12', '3/12', '2/10']}
                      paddingTop={[0, 0, 4]}
                      paddingBottom={[2, 2, 0]}
                    >
                      <Select
                        name="year"
                        isSearchable
                        label={txt('searchYearLabel', 'Útgáfuár')}
                        placeholder={txt('searchYearPlaceholder', 'Veldu ár')}
                        value={findValueOption(yearOptions, filters.year)}
                        options={yearOptions}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        onChange={(option) => {
                          const year = getRSValue(option)
                          const yearTo = !year ? undefined : filters.yearTo // clear yearTo along with year
                          doSearch({ year, yearTo })
                        }}
                        size="sm"
                      />
                    </GridColumn>
                    {filters.year && (
                      <GridColumn
                        span={['1/1', '1/1', '4/12', '3/12', '2/10']}
                        paddingTop={[0, 0, 4]}
                        paddingBottom={[2, 2, 0]}
                      >
                        <Select
                          name="yearTo"
                          isSearchable
                          label={txt('searchYearToLabel', 'Tímabili til')}
                          placeholder={txt(
                            'searchYearToPlaceholder',
                            'Veldu ár',
                          )}
                          value={findValueOption(yearToOptions, filters.yearTo)}
                          options={yearToOptions}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          onChange={(option) =>
                            doSearch('yearTo', getRSValue(option))
                          }
                          size="sm"
                        />
                      </GridColumn>
                    )}
                  </GridRow>
                </>
              )}
            </div>
          </GridContainer>
          <Box
            marginTop={2}
            className={s.clearSearch}
            hidden={!filterHasValues}
          >
            <Button
              icon="reload"
              type="button"
              size="small"
              variant="text"
              disabled={!filterHasValues}
              onClick={() => clearSearch()}
            >
              {txt('searchClearLabel')}
            </Button>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
