import { useIntl } from 'react-intl'
import Cookie from 'js-cookie'
import useSWRImmutable from 'swr/immutable'

import { toast } from '@island.is/island-ui/core'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'

export const useGetLawyers = (shouldFetch?: boolean): Lawyer[] => {
  const { formatMessage } = useIntl()
  const fetcher = (url: string): Promise<Lawyer[]> => {
    const token = Cookie.get(CSRF_COOKIE_NAME)
    const options = token
      ? { headers: { authorization: `Bearer ${token}` } }
      : {}

    return fetch(url, options).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get lawyers from lawyer registry')
      }

      return res.json()
    })
  }

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
