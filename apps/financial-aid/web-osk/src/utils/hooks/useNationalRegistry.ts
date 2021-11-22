import { NationalRegistryData } from '@island.is/financial-aid/shared/lib'
import { useEffect, useState } from 'react'

const useNationalRegistry = () => {
  const storageKey = 'nationalRegistryData'

  const [nationalRegistryData, _setNationalRegistryData] = useState<
    NationalRegistryData | undefined
  >()

  useEffect(() => {
    _setNationalRegistryData(
      sessionStorage.getItem(storageKey)
        ? JSON.parse(sessionStorage.getItem(storageKey) as string)
        : undefined,
    )
  }, [])

  const setNationalRegistryData = (data: NationalRegistryData) => {
    _setNationalRegistryData(data)
    sessionStorage.setItem(storageKey, JSON.stringify(data))
  }

  return {
    nationalRegistryData,
    setNationalRegistryData,
  }
}

export default useNationalRegistry
