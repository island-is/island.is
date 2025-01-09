import { useIntl } from 'react-intl'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'

export const useGetLawyers = (): Lawyer[] => {
  const { formatMessage } = useIntl()
  const fetcher = (url: string): Promise<Lawyer[]> =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get lawyers from lawyer registry')
      }

      return res.json()
    })

  const { data, error } = useSWR<Lawyer[]>(
    '/api/defender/lawyerRegistry',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
    },
  )

  if (error) {
    toast.error(formatMessage(errorMessages.fetchLawyers))
    return []
  }

  return data || []
}

export const useGetLawyer = (
  nationalId?: string | null,
  shouldFetch?: boolean,
): Lawyer | undefined => {
  const fetcher = (url: string): Promise<Lawyer> =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to get lawyer with nationalId ${nationalId} from lawyer registry`,
        )
      }

      return res.json()
    })

  const { data } = useSWR<Lawyer>(
    nationalId && shouldFetch
      ? `/api/defender/lawyerRegistry/${nationalId}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
    },
  )

  return data
}
