import { gql } from '@apollo/client'

export const authCustomDelegationFragment = gql`
  fragment AuthCustomDelegationFragment on AuthCustomDelegation {
    validTo
    scopes {
      id
      name
      validTo
      displayName
    }
    domain {
      name
      displayName
      organisationLogoKey
      organisationLogoUrl
    }
  }
`
