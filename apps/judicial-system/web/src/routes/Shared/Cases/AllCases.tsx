import React, { useContext } from 'react'

import { isPrisonSystemUser } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components'

import Cases from './Cases'
import PrisonCases from './PrisonCases'

export const AllCases: React.FC = () => {
  const { user } = useContext(UserContext)

  if (isPrisonSystemUser(user)) {
    return <PrisonCases />
  }

  return <Cases />
}

export default AllCases
