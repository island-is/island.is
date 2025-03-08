import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION_CERTIFICATION = gql`
  mutation FormSystemCreateOrganizationCertification(
    $input: FormSystemUpdateOrganizationCertificationTypeInput!
  ) {
    formSystemCreateOrganizationCertification(input: $input) {
      id
      certificationTypeId
    }
  }
`
