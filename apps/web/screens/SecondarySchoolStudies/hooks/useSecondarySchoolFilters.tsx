import React, { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'next-usequerystate'

import { Box, Text } from '@island.is/island-ui/core'
import { SecondarySchoolProgrammeFilterOptionsQuery } from '@island.is/web/graphql/schema'

import { m } from '../messages/messages'

type FilterOptions =
  SecondarySchoolProgrammeFilterOptionsQuery['secondarySchoolProgrammeFilterOptions']

export interface SelectedFilters {
  levels: string[]
  countryAreas: string[]
  schools: string[]
}

interface UseSecondarySchoolFiltersReturn {
  selectedFilters: SelectedFilters
  searchTerm: string
  setSearchTerm: (term: string) => void
  updateFilter: (categoryId: keyof SelectedFilters, selected: string[]) => void
  clearFilter: (categoryId: keyof SelectedFilters) => void
  clearAllFilters: () => void
  filterCategories: Array<{
    id: string
    label: string
    selected: string[]
    filters: Array<{ value: string; label: React.ReactNode }>
  }>
}

export const useSecondarySchoolFilters = (
  filterOptions: FilterOptions,
): UseSecondarySchoolFiltersReturn => {
  const { formatMessage } = useIntl()

  const [selectedFilters, setSelectedFilters] = useQueryStates(
    {
      levels: parseAsArrayOf(parseAsString).withDefault([]),
      countryAreas: parseAsArrayOf(parseAsString).withDefault([]),
      schools: parseAsArrayOf(parseAsString).withDefault([]),
    },
    { shallow: true },
  )

  const [searchTerm, setSearchTermRaw] = useQueryState(
    'q',
    parseAsString.withDefault(''),
  )

  const setSearchTerm = useCallback(
    (term: string) => setSearchTermRaw(term || null),
    [setSearchTermRaw],
  )

  const updateFilter = useCallback(
    (categoryId: keyof SelectedFilters, selected: string[]) => {
      setSelectedFilters({ [categoryId]: selected })
    },
    [setSelectedFilters],
  )

  const clearFilter = useCallback(
    (categoryId: keyof SelectedFilters) => {
      setSelectedFilters({ [categoryId]: null })
    },
    [setSelectedFilters],
  )

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({ levels: null, countryAreas: null, schools: null })
    setSearchTermRaw(null)
  }, [setSelectedFilters, setSearchTermRaw])

  const filterCategories = useMemo(() => {
    const schoolFilters =
      filterOptions?.schools
        ?.filter((s): s is typeof s & { id: string; name: string } =>
          Boolean(s.id && s.name),
        )
        .map((s) => ({
          value: s.id,
          label: s.name,
        })) ?? []

    const countryAreaFilters =
      filterOptions?.countryAreas
        ?.filter((a): a is typeof a & { id: string; name: string } =>
          Boolean(a.id && a.name),
        )
        .map((a) => ({
          value: a.id,
          label: a.name,
        })) ?? []

    const levelFilters =
      filterOptions?.levels
        ?.filter(
          (l): l is typeof l & { id: number } =>
            l.id != null && Boolean(l.shortDescription || l.name),
        )
        .map((l, index) => ({
          value: String(l.id),
          label: (
            <Box>
              <Text>{`${formatMessage(m.filters.haefnisþrep)} ${index + 1}`}</Text>
              <Text variant="small">{l.shortDescription ?? l.name ?? ''}</Text>
            </Box>
          ),
        })) ?? []

    return [
      {
        id: 'schools',
        label: `${formatMessage(m.filters.schools)} (${schoolFilters.length})`,
        selected: selectedFilters.schools,
        filters: schoolFilters,
      },
      {
        id: 'countryAreas',
        label: `${formatMessage(m.filters.countryAreas)} (${
          countryAreaFilters.length
        })`,
        selected: selectedFilters.countryAreas,
        filters: countryAreaFilters,
      },
      {
        id: 'levels',
        label: `${formatMessage(m.filters.levels)} (${levelFilters.length})`,
        selected: selectedFilters.levels,
        filters: levelFilters,
      },
    ]
  }, [filterOptions, selectedFilters, formatMessage])

  return {
    selectedFilters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterCategories,
  }
}
