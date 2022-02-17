import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { validate } from '../../validate'
import { isBusiness } from '../../stepHelper'
import { NotificationService } from '@island.is/judicial-system-web/src/services'

const useNationalRegistry = (nationalId?: string) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const isMounted = useRef(false)
  const { isValid: isValidNationalId } = validate(
    nationalId ?? '',
    'national-id',
  )

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const {
    data: personData,
    error: personError,
  } = useSWR<NationalRegistryResponsePerson>(
    shouldFetch && isValidNationalId && !isBusiness(nationalId)
      ? `/api/nationalRegistry/getPersonByNationalId?nationalId=${nationalId}`
      : null,
    fetcher,
  )

  const {
    data: businessData,
    error: businessError,
  } = useSWR<NationalRegistryResponseBusiness>(
    shouldFetch && isValidNationalId && isBusiness(nationalId)
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
  }, [nationalId])

  useEffect(() => {
    console.log('personData', personData)
    console.log('businessData', businessData)
    if (
      (personData && personData.error) ||
      (businessData && businessData.error)
    ) {
      NotificationService.error({
        title: 'Villa í uppflettingu í Þjóðskrá',
        text: 'Upp kom villa við að sækja gögn úr Þjóðskrá',
      })
    }
  }, [personData, businessData])

  return {
    personData,
    personError,
    businessData,
    businessError,
  }
}

export default useNationalRegistry
