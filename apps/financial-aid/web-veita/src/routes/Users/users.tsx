import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import { Staff } from '@island.is/financial-aid/shared/lib'
import { StaffForMunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'

export const Users = () => {
  const { data, error, loading } = useQuery<{ users: Staff[] }>(
    StaffForMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [users, setUsers] = useState<Staff[]>()

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users)
    }
  }, [data])

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {users && <div>blablablal</div>}

      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default Users
