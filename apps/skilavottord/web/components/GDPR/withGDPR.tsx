import React, { useContext } from 'react'
import { NextComponentType } from 'next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { SkeletonLoader } from '@island.is/island-ui/core'
import { UserContext } from '@island.is/skilavottord-web/context'
import { PageLayout, GDPR } from '@island.is/skilavottord-web/components'
import { Query } from '@island.is/skilavottord-web/graphql/schema'

export const SkilavottordGdprQuery = gql`
  query skilavottordGdprQuery($nationalId: String!) {
    skilavottordGdpr(nationalId: $nationalId) {
      nationalId
      gdprStatus
    }
  }
`

export const withGDPR = (WrappedComponent: NextComponentType) => () => {
  const { user } = useContext(UserContext)

  const nationalId = user?.nationalId ?? ''
  const { data, loading } = useQuery<Query>(SkilavottordGdprQuery, {
    variables: { nationalId },
  })

  if (loading) {
    return (
      <PageLayout>
        <SkeletonLoader space={2} repeat={4} />
      </PageLayout>
    )
  } else if (data?.skilavottordGdpr?.gdprStatus === 'true') {
    return <WrappedComponent />
  }

  return <GDPR />
}

export default withGDPR
