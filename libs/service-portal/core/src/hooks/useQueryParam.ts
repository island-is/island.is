import { useMemo } from 'react'
import { useLocation } from 'react-use'

export const useQueryParam = (key: string) => {
  const { search } = useLocation()
  const query = useMemo(() => new URLSearchParams(search), [search])

  return query.get(key)
}
