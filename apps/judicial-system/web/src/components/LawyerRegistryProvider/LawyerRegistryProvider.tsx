import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import { Lawyer } from '@island.is/judicial-system/types'

interface LawyerRegistryContext {
  lawyers?: Lawyer[]
}

const fetcher = (url: string): Promise<Lawyer[]> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to get lawyers from lawyer registry')
    }

    return res.json()
  })

export const LawyerRegistryContext = createContext<LawyerRegistryContext>({
  lawyers: [],
})

export const LawyerRegistryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: lawyers, error } = useSWR<Lawyer[]>(
    '/api/defender/lawyerRegistry!',
    fetcher,
    { shouldRetryOnError: false },
  )

  useEffect(() => {
    if (error) {
      toast.error('Failed to get lawyers from lawyer registry')
    }
  }, [error])

  return (
    <LawyerRegistryContext.Provider value={{ lawyers }}>
      {children}
    </LawyerRegistryContext.Provider>
  )
}
export const useLawyerRegistry = () => useContext(LawyerRegistryContext)
