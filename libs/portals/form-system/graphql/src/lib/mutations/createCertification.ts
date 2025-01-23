import { gql } from '@apollo/client'

export const CREATE_CERTIFICATION = gql`
  mutation FormSystemCreateCertification(
    $input: FormSystemCreateCertificationInput!
  ) {
    formSystemCreateCertification(input: $input) {
      id
      certificationTypeId
    }
  }
`
