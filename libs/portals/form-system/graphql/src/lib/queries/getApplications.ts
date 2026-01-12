import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATIONS = gql`
  query FormSystemApplications($input: FormSystemApplicationsInput!) {
    formSystemApplications(input: $input) {
      applications {
        ...Application
      }
      organizations {
        label
        value
        isSelected
      }
      total
      isLoginTypeAllowed
    }
  }
  ${ApplicationFragment}
`
