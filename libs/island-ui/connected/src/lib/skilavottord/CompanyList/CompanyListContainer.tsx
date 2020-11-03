import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { CompanyList } from './CompanyList'

export const CompanyListContainer = ({ connected = true, graphqlLink = 'skilavottord.island.is/api/graphql' }) => {
  
  const client = new ApolloClient({
    name: 'island-ui-connected-skilavottord-client',
    version: '0.1',
    uri: graphqlLink,
    cache: new InMemoryCache(),
  })

  if (connected) {
    return (
      <ApolloProvider client={client}>
        <CompanyList />
      </ApolloProvider>
    )
  } else {
    return <CompanyList />
  }
}

export default CompanyListContainer
