import React, { useContext } from 'react'
import { NextComponentType } from 'next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { GDPR, PageLayout } from '@island.is/skilavottord-web/components'
import { Query } from '@island.is/skilavottord-web/graphql/schema'
import { UserContext } from '@island.is/skilavottord-web/context'

export const SkilavottordGdprQuery = gql`
  query skilavottordGdprQuery {
    skilavottordGdpr {
      nationalId
      gdprStatus
    }
  }
`

export const withGDPR = (WrappedComponent: NextComponentType) => () => {
  const { data, loading } = useQuery<Query>(SkilavottordGdprQuery)
  const { isAuthenticated } = useContext(UserContext)

  if (loading || !isAuthenticated) {
    return (
      <PageLayout>
        <Stack space={6}>
          <SkeletonLoader repeat={1} />
          <SkeletonLoader space={3} repeat={2} height="100px" />
        </Stack>
      </PageLayout>
    )
  } else if (data?.skilavottordGdpr?.gdprStatus === 'true') {
    return <WrappedComponent />
  }
  return <GDPR />
}

export default withGDPR
