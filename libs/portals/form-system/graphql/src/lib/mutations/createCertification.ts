import { gql } from '@apollo/client'

export const CREATE_CERTIFICATION = gql`
  mutation createFormSystemCertification(
    $input: CreateFormSystemCertificationInput!
  ) {
    createFormSystemCertification(input: $input) {
      id
      certificationTypeId
    }
  }
`
