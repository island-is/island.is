import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

import type { Lawyer } from '@island.is/judicial-system/types'
import {
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useLawyerRegistry } from '@island.is/judicial-system-web/src/utils/hooks/useLawyerRegistry/useLawyerRegistry'

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
