import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApplicationFilters } from '../../types/filters'

const PARAM_KEYS = ['page', 'q', 'nid', 'from', 'to', 'inst', 'type'] as const

export const emptyFilters: ApplicationFilters = {
  searchStr: '',
  nationalId: '',
  institution: '',
  period: {},
}

const parseDate = (value: string | null): Date | undefined => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const formatDate = (date: Date | undefined): string | null =>
  date ? date.toISOString().slice(0, 10) : null

const parseFilters = (params: URLSearchParams): ApplicationFilters => ({
  searchStr: params.get('q') ?? '',
  nationalId: params.get('nid') ?? '',
  institution: params.get('inst') ?? '',
  typeIdValue: params.get('type') ?? undefined,
  period: {
    from: parseDate(params.get('from')),
    to: parseDate(params.get('to')),
  },
})

const parsePage = (params: URLSearchParams): number => {
  const raw = Number(params.get('page') ?? '1')
  return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
}

const applyFilters = (
  prev: URLSearchParams,
  filters: ApplicationFilters,
): URLSearchParams => {
  const next = new URLSearchParams(prev)
  const set = (key: string, value: string | null | undefined) => {
    if (value) next.set(key, value)
    else next.delete(key)
  }
  set('q', filters.searchStr)
  set('nid', filters.nationalId)
  set('inst', filters.institution)
  set('type', filters.typeIdValue)
  set('from', formatDate(filters.period?.from))
  set('to', formatDate(filters.period?.to))
  return next
}

const datesEqual = (a?: Date, b?: Date) => {
  if (!a && !b) return true
  if (!a || !b) return false
  return a.getTime() === b.getTime()
}

const filtersEqual = (a: ApplicationFilters, b: ApplicationFilters) =>
  (a.searchStr ?? '') === (b.searchStr ?? '') &&
  (a.nationalId ?? '') === (b.nationalId ?? '') &&
  (a.institution ?? '') === (b.institution ?? '') &&
  (a.typeIdValue ?? '') === (b.typeIdValue ?? '') &&
  datesEqual(a.period?.from, b.period?.from) &&
  datesEqual(a.period?.to, b.period?.to)

export const useOverviewUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const page = useMemo(() => parsePage(searchParams), [searchParams])

  const setPage = useCallback(
    (next: number) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next <= 1) params.delete('page')
          else params.set('page', String(next))
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setFilters = useCallback(
    (updater: (prev: ApplicationFilters) => ApplicationFilters) => {
      const current = parseFilters(searchParams)
      const next = updater(current)
      // Skip URL writes when nothing actually changed. Otherwise mount-time
      // debounced callbacks would strip the `page` param on every render.
      if (filtersEqual(current, next)) return
      setSearchParams(
        (prev) => {
          const params = applyFilters(prev, next)
          // Any real filter change resets pagination.
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [searchParams, setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const key of PARAM_KEYS) next.delete(key)
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  return { page, filters, setPage, setFilters, resetFilters }
}
