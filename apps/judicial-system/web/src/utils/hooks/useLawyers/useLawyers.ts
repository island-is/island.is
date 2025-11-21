import { useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import { toast } from '@island.is/island-ui/core'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'

export const useGetLawyers = (shouldFetch?: boolean): Lawyer[] => {
  const { formatMessage } = useIntl()
  const fetcher = (url: string): Promise<Lawyer[]> =>
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get lawyers from lawyer registry')
      }

      return res.json()
    })

  const { data, error } = useSWRImmutable<Lawyer[]>(
    shouldFetch ? '/api/defender/lawyerRegistry' : null,
    fetcher,
    { shouldRetryOnError: false, errorRetryCount: 0 },
  )

  if (error) {
    toast.error(formatMessage(errorMessages.fetchLawyers))
    return []
  }

  return data ?? []
}
