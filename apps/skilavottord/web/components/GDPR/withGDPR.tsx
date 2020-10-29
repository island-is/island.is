import React, { useContext } from 'react'
import { UserContext } from '@island.is/skilavottord-web/context'
import { useQuery } from '@apollo/client'
import { GET_GDPR_INFO } from '@island.is/skilavottord-web/graphql/queries'
import { GDPR } from './GDPR'

export const withGDPR = (WrappedComponent) => () => {
  const { user } = useContext(UserContext)

  const nationalId = user?.nationalId ?? ''
  const { data, loading } = useQuery(GET_GDPR_INFO, {
    variables: { nationalId },
  })

  if (loading || data) {
    return <WrappedComponent />
  } else if (!data) {
    return <GDPR />
  }
}

export default withGDPR
