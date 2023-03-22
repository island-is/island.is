import gql from 'graphql-tag'

export const GET_AUTH_URL = gql`
  query consultationPortalAuthenticationUrl {
    consultationPortalAuthenticationUrl
  }
`
