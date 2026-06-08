import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import Cookie from 'js-cookie'

import { toast } from '@island.is/island-ui/core'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'

export const useGetLawyers = (shouldFetch?: boolean): Lawyer[] => {
  const { formatMessage } = useIntl()
  const [lawyers, setLawyers] = useState<Lawyer[]>([])

  useEffect(() => {
    if (!shouldFetch) {
      setLawyers([])
      return
    }

    const controller = new AbortController()

    const token = Cookie.get(CSRF_COOKIE_NAME)
    const headers = token ? { authorization: `Bearer ${token}` } : undefined

    fetch('/api/defender/lawyerRegistry', {
      headers,
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to get lawyers from lawyer registry')
        }

        return res.json()
      })
      .then(setLawyers)
      .catch((e) => {
        if (e.name !== 'AbortError') {
          toast.error(formatMessage(errorMessages.fetchLawyers))
          setLawyers([])
        }
      })

    return () => controller.abort()
  }, [shouldFetch, formatMessage])

  return lawyers
}
