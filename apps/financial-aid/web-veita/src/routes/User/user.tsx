import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  ApplicationNotFound,
  ApplicationSkeleton,
  LoadingContainer,
  UserProfile,
} from '@island.is/financial-aid-web/veita/src/components'
import { StaffQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { Staff } from '@island.is/financial-aid/shared/lib'

export const User = () => {
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

  const refreshUser = () => {
    getStaffMember()
  }

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      {data ? (
        <UserProfile user={data.user} onUpdateStaff={refreshUser} />
      ) : (
        <ApplicationNotFound />
      )}
    </LoadingContainer>
  )
}

export default User
