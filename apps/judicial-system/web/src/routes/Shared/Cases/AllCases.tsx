import { FC, useContext } from 'react'

import { isPublicProsecutionOfficeUser } from '@island.is/judicial-system/types'
import {
  Skeleton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'

import PublicProsecutorCases from '../../PublicProsecutor/Cases/PublicProsecutorCases'
import Cases from './Cases'

export const AllCases: FC = () => {
  const { isLoading, user } = useContext(UserContext)
  if (isLoading) {
    return <Skeleton />
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return <PublicProsecutorCases />
  }

  return <Cases />
}

export default AllCases
