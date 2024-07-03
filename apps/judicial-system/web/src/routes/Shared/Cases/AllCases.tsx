import React, { FC, useContext } from 'react'

import {
  isPrisonSystemUser,
  isPublicProsecutorUser,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components'

import PublicProsecutorCases from '../../PublicProsecutor/Cases/PublicProsecutorCases'
import Cases from './Cases'
import PrisonCases from './PrisonCases'

export const AllCases: FC = () => {
  const { user } = useContext(UserContext)

  if (isPrisonSystemUser(user)) {
    return <PrisonCases />
  }

  if (isPublicProsecutorUser(user)) {
    return <PublicProsecutorCases />
  }

  return <Cases />
}

export default AllCases
