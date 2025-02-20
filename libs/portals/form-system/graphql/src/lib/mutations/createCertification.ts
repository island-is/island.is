import { gql } from '@apollo/client'

export const CREATE_CERTIFICATION = gql`
  mutation FormSystemCreateCertification(
    $input: FormSystemCreateFormCertificationTypeInput!
  ) {
    formSystemCreateFormCertificationType(input: $input) {
      id
      certificationTypeId
    }
  }
`
