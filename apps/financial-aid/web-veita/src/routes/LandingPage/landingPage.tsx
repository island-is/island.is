import React, { useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import { Routes, StaffRole } from '@island.is/financial-aid/shared/lib'

import { AdminContext } from '../../components/AdminProvider/AdminProvider'

export const LandingPage = () => {
  const router = useRouter()
  const { admin, isAuthenticated } = useContext(AdminContext)

  if (isAuthenticated && admin && admin.staff) {
    if (admin.staff.roles.includes(StaffRole.EMPLOYEE)) {
      router.push(Routes.newCases)
    } else if (admin.staff.roles.includes(StaffRole.ADMIN)) {
      router.push(Routes.users)
    }
  }

  return (
    <LoadingContainer isLoading={true} loader={<ApplicationOverviewSkeleton />}>
      <Box className={`contentUp delay-25`} marginTop={15}></Box>
    </LoadingContainer>
  )
}

export default LandingPage
