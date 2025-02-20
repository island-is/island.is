import { gql } from '@apollo/client'
import { OrganizationFragment } from '../fragments/organization'

export const GET_ORGANIZATION = gql`
  query FormSystemGetOrganization($input: FormSystemGetOrganizationInput!) {
    formSystemGetOrganization(input: $input) {
      ...OrganizationDto
    }
  }
  ${OrganizationFragment}
`
