import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import {
  isDefenceUser,
  isDistrictCourtUser,
  Lawyer,
} from '@island.is/judicial-system/types'
import {
  Database,
  useIndexedDB,
} from '../../utils/hooks/useIndexedDB/useIndexedDB'
import { UserContext } from '../UserProvider/UserProvider'

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
  const { user } = useContext(UserContext)
  const shouldFetch = isDistrictCourtUser(user) || isDefenceUser(user)
  const { allLawyers: lawyers } = useIndexedDB(
    Database.name,
    Database.lawyerTable,
    shouldFetch,
  )

  return (
    <LawyerRegistryContext.Provider value={{ lawyers }}>
      {children}
    </LawyerRegistryContext.Provider>
  )
}
export const useLawyerRegistry = () => useContext(LawyerRegistryContext)
