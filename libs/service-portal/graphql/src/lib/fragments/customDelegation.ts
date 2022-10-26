import { gql, enableExperimentalFragmentVariables } from '@apollo/client'
import { authApiScopeFragment } from './scope'

enableExperimentalFragmentVariables()

export const authCustomDelegationFragment = gql`
  fragment AuthCustomDelegationFragment on AuthCustomDelegation {
    validTo
    scopes {
      id
      name
      validTo
      displayName
      apiScope(lang: $lang) {
        ...AuthApiScopeFragment
      }
    }
    domain {
      name
      displayName
      organisationLogoKey
      organisationLogoUrl
    }
  }
  ${authApiScopeFragment}
`
