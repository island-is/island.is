import { gql } from '@apollo/client'

export const CREATE_CERTIFICATION = gql`
  mutation createFormSystemCertification(
    $input: FormSystemCreateCertificationInput!
  ) {
    createFormSystemCertification(input: $input) {
      id
      certificationTypeId
    }
  }
`
