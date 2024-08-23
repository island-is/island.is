import { gql } from '@apollo/client'
import { OrganizationFragment } from '../fragments/organization'

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      ...Organization
    }
  }
  ${OrganizationFragment}
`
