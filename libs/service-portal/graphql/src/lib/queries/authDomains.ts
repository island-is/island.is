import gql from 'graphql-tag'

export const AUTH_DOMAINS_QUERY = gql`
  query AuthDomains($input: AuthDomainsInput!) {
    authDomains(input: $input) {
      name
      displayName
      description
      nationalId
      organisationLogoKey
      organisationLogoUrl
    }
  }
`
