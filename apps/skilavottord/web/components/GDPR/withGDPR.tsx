import React, { useContext } from 'react'
import { UserContext } from '@island.is/skilavottord-web/context'
import { useQuery } from '@apollo/client'
import { GDPR_INFO_BY_NATIONAL_ID } from '@island.is/skilavottord-web/graphql/queries'
import { GDPR } from './GDPR'

export const withGDPR = (WrappedComponent) => () => {
  const { user } = useContext(UserContext)

  const nationalId = user?.nationalId ?? ''
  const { data, loading } = useQuery(GDPR_INFO_BY_NATIONAL_ID, {
    variables: { nationalId },
  })

  if (loading || data) {
    return <WrappedComponent />
  } else if (!data) {
    return <GDPR />
  }
}

export default withGDPR
