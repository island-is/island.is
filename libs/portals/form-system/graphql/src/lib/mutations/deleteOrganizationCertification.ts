import { gql } from '@apollo/client'

export const DELETE_ORGANIZATION_CERTIFICATION = gql`
  mutation FormSystemDeleteOrganizationCertification(
    $input: FormSystemUpdateOrganizationCertificationTypeInput!
  ) {
    formSystemDeleteOrganizationCertification(input: $input)
  }
`
