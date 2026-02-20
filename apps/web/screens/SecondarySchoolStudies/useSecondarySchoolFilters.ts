import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'

import { SecondarySchoolProgrammeFilterOptionsQuery } from '@island.is/web/graphql/schema'

type FilterOptions =
  SecondarySchoolProgrammeFilterOptionsQuery['secondarySchoolProgrammeFilterOptions']

export interface SelectedFilters {
  studyTracks: string[]
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
    filters: Array<{ value: string; label: string }>
  }>
}

const initialFilters: SelectedFilters = {
  studyTracks: [],
  levels: [],
  countryAreas: [],
  schools: [],
}

export const useSecondarySchoolFilters = (
  filterOptions: FilterOptions,
  pathname: string,
): UseSecondarySchoolFiltersReturn => {
  const { query, replace, isReady } = useRouter()

  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const searchTermHasBeenInitialized = useRef(false)

  // Parse query params on initial load
  useEffect(() => {
    if (!isReady) return

    const updatedFilters: Partial<SelectedFilters> = {}

    if (query.studyTracks) {
      updatedFilters.studyTracks =
        typeof query.studyTracks === 'string'
          ? [query.studyTracks]
          : query.studyTracks
    }

    if (query.levels) {
      updatedFilters.levels =
        typeof query.levels === 'string' ? [query.levels] : query.levels
    }

    if (query.countryAreas) {
      updatedFilters.countryAreas =
        typeof query.countryAreas === 'string'
          ? [query.countryAreas]
          : query.countryAreas
    }

    if (query.schools) {
      updatedFilters.schools =
        typeof query.schools === 'string' ? [query.schools] : query.schools
    }

    if (Object.keys(updatedFilters).length > 0) {
      setSelectedFilters((prev) => ({
        ...prev,
        ...updatedFilters,
      }))
    }

    // Search term initialization
    if (query.q && !searchTerm && !searchTermHasBeenInitialized.current) {
      searchTermHasBeenInitialized.current = true
      setSearchTerm(query.q as string)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  // Sync state to URL when filters change
  useEffect(() => {
    if (!isReady) return

    const updatedQuery: Record<string, string | string[]> = {}

    // Preserve non-filter query params (like page)
    if (query.page) {
      updatedQuery.page = query.page as string
    }

    if (searchTerm) {
      updatedQuery.q = searchTerm
    }

    if (selectedFilters.studyTracks.length > 0) {
      updatedQuery.studyTracks = selectedFilters.studyTracks
    }

    if (selectedFilters.levels.length > 0) {
      updatedQuery.levels = selectedFilters.levels
    }

    if (selectedFilters.countryAreas.length > 0) {
      updatedQuery.countryAreas = selectedFilters.countryAreas
    }

    if (selectedFilters.schools.length > 0) {
      updatedQuery.schools = selectedFilters.schools
    }

    // Only update URL if query actually changed
    const currentQuery = { ...query }
    // Remove undefined/empty values for comparison
    Object.keys(currentQuery).forEach((key) => {
      if (
        currentQuery[key] === undefined ||
        (Array.isArray(currentQuery[key]) &&
          (currentQuery[key] as string[]).length === 0)
      ) {
        delete currentQuery[key]
      }
    })

    if (!isEqual(currentQuery, updatedQuery)) {
      replace(
        {
          pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, searchTerm, isReady])

  const updateFilter = useCallback(
    (categoryId: keyof SelectedFilters, selected: string[]) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [categoryId]: selected,
      }))
    },
    [],
  )

  const clearFilter = useCallback((categoryId: keyof SelectedFilters) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [categoryId]: [],
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedFilters(initialFilters)
    setSearchTerm('')
  }, [])

  const filterCategories = useMemo(
    () => [
      {
        id: 'schools',
        label: 'Framhaldsskólar',
        selected: selectedFilters.schools,
        filters:
          filterOptions?.schools
            ?.filter((s): s is typeof s & { id: string; name: string } =>
              Boolean(s.id && s.name),
            )
            .map((s) => ({
              value: s.id,
              label: s.abbreviation ?? s.name,
            })) ?? [],
      },
      {
        id: 'countryAreas',
        label: 'Landssvæði',
        selected: selectedFilters.countryAreas,
        filters:
          filterOptions?.countryAreas
            ?.filter((a): a is typeof a & { id: string; name: string } =>
              Boolean(a.id && a.name),
            )
            .map((a) => ({
              value: a.id,
              label: a.name,
            })) ?? [],
      },
      {
        id: 'studyTracks',
        label: 'Flokkun náms',
        selected: selectedFilters.studyTracks,
        filters:
          filterOptions?.studyTracks
            ?.filter((t): t is typeof t & { isced: string; name: string } =>
              Boolean(t.isced && t.name),
            )
            .map((t) => ({
              value: t.isced,
              label: t.name,
            })) ?? [],
      },
      {
        id: 'levels',
        label: 'Námsstig',
        selected: selectedFilters.levels,
        filters:
          filterOptions?.levels
            ?.filter(
              (l): l is typeof l & { id: number } =>
                l.id != null && Boolean(l.shortDescription || l.name),
            )
            .map((l) => ({
              value: String(l.id),
              label: l.shortDescription ?? l.name ?? '',
            })) ?? [],
      },
    ],
    [filterOptions, selectedFilters],
  )

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
