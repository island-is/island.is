import { useEffect, useState } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { isBusiness } from '../../utils'
import { validate } from '../../validate'

export type UseNationalRegistryOptions = {
  /** When true, no request is made and cached lookup state is cleared. */
  skip?: boolean
}

const useNationalRegistry = (
  nationalId?: string | null,
  options?: UseNationalRegistryOptions,
) => {
  const skip = options?.skip ?? false
  const [personData, setPersonData] = useState<NationalRegistryResponsePerson>()
  const [businessData, setBusinessData] =
    useState<NationalRegistryResponseBusiness>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false)

  useEffect(() => {
    if (skip) {
      setPersonData(undefined)
      setBusinessData(undefined)
      setError(undefined)
      setNotFound(false)
      setIsLoading(false)
      return
    }

    const cleanNationalId = nationalId?.replace('-', '')
    const isValidNationalId = validate([
      [cleanNationalId, ['national-id']],
    ]).isValid

    setError(undefined)
    setNotFound(false)

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
  }, [nationalId, skip])

  return { personData, businessData, error, isLoading, notFound }
}

export default useNationalRegistry
