import { useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

import { NationalRegistryResponse } from '@island.is/judicial-system-web/src/types'

const useNationalRegistry = (nationalId?: string) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const isMounted = useRef(false)

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  console.log(shouldFetch, nationalId?.replace('-', '').length === 10)
  const { data, error } = useSWR<NationalRegistryResponse>(
    shouldFetch && nationalId?.replace('-', '').length === 10
      ? `/api/nationalRegistry/getByNationalId?nationalId=${nationalId}`
      : null,
    fetcher,
  )

  useMemo(() => {
    if (isMounted.current) {
      setShouldFetch(true)
    } else {
      isMounted.current = true
    }
  }, [nationalId])

  return {
    person: data,
    error,
  }
}

export default useNationalRegistry
