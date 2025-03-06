import { gql } from '@apollo/client'
import { OrganizationFragment } from '../fragments/organization'

export const GET_ORGANIZATION = gql`
  query FormSystemOrganization($input: FormSystemGetOrganizationInput!) {
    formSystemOrganization(input: $input) {
      ...Organization
    }
  }
  ${OrganizationFragment}
`
