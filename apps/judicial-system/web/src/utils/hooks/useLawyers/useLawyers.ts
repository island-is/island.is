import { useIntl } from 'react-intl'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'
import type { Lawyer } from '@island.is/judicial-system-web/src/types'

export const useGetLawyers = (): Lawyer[] => {
  const { formatMessage } = useIntl()

  const { data, error } = useSWR<Lawyer[]>(
    '/api/lawyers/getLawyers',
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnMount: true, errorRetryCount: 2 },
  )

  if (error) {
    toast.error(formatMessage(errorMessages.fetchLawyers))
    return []
  }

  return data || []
}

export const useGetLawyer = (
  nationalId?: string,
  shouldFetch?: boolean,
): Lawyer | undefined => {
  const fetchWithNationalId = (url: string, nationalId: string) =>
    fetch(`${url}?nationalId=${nationalId}`).then((res) => res.json())

  const { data } = useSWR<Lawyer>(
    nationalId && shouldFetch ? [`/api/lawyers/getLawyer`, nationalId] : null,
    fetchWithNationalId,
    { revalidateOnMount: true, errorRetryCount: 2 },
  )

  return data
}
