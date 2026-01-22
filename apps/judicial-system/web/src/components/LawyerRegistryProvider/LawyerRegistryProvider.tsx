import { createContext, FC, PropsWithChildren, useContext } from 'react'

import {
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  Lawyer,
} from '@island.is/judicial-system/types'

import { useLawyerRegistry } from '../../utils/hooks/useLawyerRegistry/useLawyerRegistry'
import { UserContext } from '../UserProvider/UserProvider'

interface LawyerRegistryContext {
  lawyers?: Lawyer[]
}

export const LawyerRegistryContext = createContext<LawyerRegistryContext>({
  lawyers: [],
})

export const LawyerRegistryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(UserContext)
  const shouldFetch =
    isDistrictCourtUser(user) ||
    isDefenceUser(user) ||
    isProsecutionUser(user) ||
    isPublicProsecutionOfficeUser(user)
  const { allLawyers: lawyers } = useLawyerRegistry(shouldFetch)

  return (
    <LawyerRegistryContext.Provider value={{ lawyers }}>
      {children}
    </LawyerRegistryContext.Provider>
  )
}
