import React, { useContext } from 'react'

import { UserContext } from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import Cases from './Cases'
import PrisonCases from './PrisonCases'

export const AllCases: React.FC = () => {
  const { user } = useContext(UserContext)

  if (user?.role === UserRole.PRISON_SYSTEM_STAFF) {
    return <PrisonCases />
  }

  return <Cases />
}

export default AllCases
