import useSWR from 'swr'

import { NationalRegistryResponse } from '@island.is/judicial-system-web/pages/api/nationalRegistry/getByNationalId'

const useNationalRegistry = (nationalId?: string) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR<NationalRegistryResponse>(
    `/api/nationalRegistry/getByNationalId?nationalId=${nationalId}`,
    fetcher,
  )

  return {
    person: data,
    error,
  }
}

export default useNationalRegistry
