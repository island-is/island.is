import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { isBusiness } from '../../utils'
import { validate } from '../../validate'

const useNationalRegistry = (nationalId?: string | null) => {
  const [personData, setPersonData] = useState<NationalRegistryResponsePerson>()
  const [businessData, setBusinessData] =
    useState<NationalRegistryResponseBusiness>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!nationalId) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const isBusinessNationalId = isBusiness(nationalId)
    const url = `/api/nationalRegistry/${
      isBusinessNationalId ? 'getBusinessByNationalId' : 'getPersonByNationalId'
    }?nationalId=${nationalId}`

    setIsLoading(true)

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(isBusinessNationalId ? setBusinessData : setPersonData)
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError(e instanceof Error ? e : new Error('Unknown error'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [nationalId])

  return { personData, businessData, error, isLoading }
}

export default useNationalRegistry
