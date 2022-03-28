import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import type { Lawyer } from '@island.is/judicial-system-web/src/types'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'

const useLawyers = (): Lawyer[] => {
  const { formatMessage } = useIntl()

  const { data, error } = useSWR<Lawyer[]>(
    '/api/lawyers',
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnMount: true, errorRetryCount: 2 },
  )

  if (error) {
    toast.error(formatMessage(errorMessages.fetchLawyers))
    return []
  }

  return data || []
}

export default useLawyers
