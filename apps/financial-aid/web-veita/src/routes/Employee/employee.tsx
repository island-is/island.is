import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  ProfileNotFound,
  ApplicationSkeleton,
  LoadingContainer,
  EmployeeProfile,
} from '@island.is/financial-aid-web/veita/src/components'
import { StaffQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { Staff } from '@island.is/financial-aid/shared/lib'

export const Employee = () => {
  const router = useRouter()

  const [getStaffMember, { data, loading }] = useLazyQuery<{ user: Staff }>(
    StaffQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    getStaffMember()
  }, [])

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      {data ? (
        <EmployeeProfile user={data.user} />
      ) : (
        <ProfileNotFound backButtonHref="/notendur" />
      )}
    </LoadingContainer>
  )
}

export default Employee
