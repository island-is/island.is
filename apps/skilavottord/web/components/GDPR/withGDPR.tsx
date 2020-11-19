import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { UserContext } from '@island.is/skilavottord-web/context'
import { GDPR_INFO_BY_NATIONAL_ID } from '@island.is/skilavottord-web/graphql/queries'
import { PageLayout, GDPR } from '@island.is/skilavottord-web/components'

export const withGDPR = (WrappedComponent) => () => {
  const { user } = useContext(UserContext)

  const nationalId = user?.nationalId ?? ''
  const { data, loading } = useQuery(GDPR_INFO_BY_NATIONAL_ID, {
    variables: { nationalId },
  })

  if (loading) {
    return (
      <PageLayout>
        <SkeletonLoader space={2} repeat={4} />
      </PageLayout>
    )
  } else if (data) {
    return <WrappedComponent />
  }

  return <GDPR />
}

export default withGDPR
