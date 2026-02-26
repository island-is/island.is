import { useEffect, useState } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { isBusiness } from '../../utils'
import { validate } from '../../validate'
import { fakePerson } from './constants'

const useNationalRegistry = (nationalId?: string | null) => {
  const [personData, setPersonData] = useState<NationalRegistryResponsePerson>()
  const [businessData, setBusinessData] =
    useState<NationalRegistryResponseBusiness>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false)

  useEffect(() => {
    const cleanNationalId = nationalId?.replace('-', '')
    const isValidNationalId = validate([
      [cleanNationalId, ['national-id']],
    ]).isValid
    const isFakePerson = nationalId === '000000-0000'

    setError(undefined)
    setNotFound(false)

    // Each api call costs actualy money. This allows us to develop and test
    // without actually making a real api call.
    if (isFakePerson) {
      setBusinessData(undefined)
      setPersonData({
        items: [fakePerson],
      })

      setIsLoading(false)
      return
    }

    if (!nationalId || !isValidNationalId) {
      setPersonData(undefined)
      setBusinessData(undefined)

      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const isBusinessNationalId = isBusiness(nationalId)
    const url = `/api/nationalRegistry/${
      isBusinessNationalId
        ? 'getBusinessesByNationalId'
        : 'getPersonByNationalId'
    }?nationalId=${nationalId}`

    setIsLoading(true)

    // Reset state before fetching new data
    setPersonData(undefined)
    setBusinessData(undefined)
    setNotFound(false)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        return res.json()
      })
      .then((res) => {
        if (res.items && res.items.length === 0) {
          setNotFound(true)
          return
        }

        return res
      })
      .then(isBusinessNationalId ? setBusinessData : setPersonData)
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError(e instanceof Error ? e : new Error('Unknown error'))
          toast.error('Upp kom villa við að sækja gögn frá Þjóðskrá')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [nationalId])

  return { personData, businessData, error, isLoading, notFound }
}

export default useNationalRegistry
