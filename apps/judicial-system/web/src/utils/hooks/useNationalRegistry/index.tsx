import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

import { NationalRegistryResponse } from '@island.is/judicial-system-web/src/types'

import { validate } from '../../validate'

const useNationalRegistry = (nationalId?: string) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const isMounted = useRef(false)
  const { isValid: isValidNationalId } = validate(
    nationalId ?? '',
    'national-id',
  )

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR<NationalRegistryResponse>(
    shouldFetch && isValidNationalId
      ? `/api/nationalRegistry/getByNationalId?nationalId=${nationalId}`
      : null,
    fetcher,
  )

  useEffect(() => {
    if (shouldFetch) {
      return
    } else if (isMounted.current) {
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
