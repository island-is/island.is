import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Text, Box, Divider, Input, Checkbox } from '@island.is/island-ui/core'
import * as styles from './user.css'
import cn from 'classnames'
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

  const { data, loading } = useQuery<{ user: Staff }>(StaffQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  console.log(data)

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      {data ? <UserProfile user={data.user} /> : <ApplicationNotFound />}
    </LoadingContainer>
  )
}

export default User
