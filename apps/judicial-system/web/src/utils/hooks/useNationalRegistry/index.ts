import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { isBusiness } from '../../stepHelper'
import { validate } from '../../validate'

const useNationalRegistry = (nationalId?: string | null) => {
  const { formatMessage } = useIntl()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const isMounted = useRef(false)

  const isValidNationalId = validate([[nationalId, ['national-id']]]).isValid

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data: personData, error: personError } =
    useSWR<NationalRegistryResponsePerson>(
      shouldFetch && nationalId && isValidNationalId && !isBusiness(nationalId)
        ? `/api/nationalRegistry/getPersonByNationalId?nationalId=${nationalId}`
        : null,
      fetcher,
    )

  const { data: businessData, error: businessError } =
    useSWR<NationalRegistryResponseBusiness>(
      shouldFetch && nationalId && isValidNationalId && isBusiness(nationalId)
        ? `/api/nationalRegistry/getBusinessesByNationalId?nationalId=${nationalId}`
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
  }, [nationalId, shouldFetch])

  useEffect(() => {
    if (
      (personData && personData.error) ||
      personError ||
      (businessData && businessData.error) ||
      businessError
    ) {
      toast.error(formatMessage(errors.nationalRegistry))
    }
  }, [personData, businessData, personError, businessError, formatMessage])

  return {
    personData,
    personError,
    businessData,
    businessError,
  }
}

export default useNationalRegistry
