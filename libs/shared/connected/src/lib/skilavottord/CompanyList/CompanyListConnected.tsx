import React, { FC } from 'react'
import { ApolloClient, useQuery, InMemoryCache, HttpLink } from '@apollo/client'
import gql from 'graphql-tag'

import CompanyList from './CompanyList'

export const RECYCLING_PARTNERS = gql`
  query skilavottordAllActiveRecyclingPartners {
    skilavottordAllActiveRecyclingPartners {
      companyId
      companyName
      address
      postnumber
      city
      website
      phone
      active
    }
  }
`

export interface CompanyListConnectedProps {
  graphqlLink: string
}

export const CompanyListConnected: FC<
  React.PropsWithChildren<CompanyListConnectedProps>
> = ({ graphqlLink = '' }) => {
  const uri = graphqlLink || 'https://skilavottord.dev01.devland.is/api/graphql'

  const { data, error, loading } = useQuery(RECYCLING_PARTNERS, {
    client: new ApolloClient({
      name: 'shared-connected-skilavottord-client',
      version: '0.1',
      link: new HttpLink({
        uri: graphqlLink,
      }),
      cache: new InMemoryCache(),
    }),
  })

  if (error || (loading && !data)) {
    return null
  }

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []

  return <CompanyList recyclingPartners={recyclingPartners} />
}

export default CompanyListConnected
