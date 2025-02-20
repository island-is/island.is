import { gql } from '@apollo/client'

export const DELETE_CERTIFICATION = gql`
  mutation FormSystemDeleteCertification(
    $input: FormSystemDeleteFormCertificationTypeInput!
  ) {
    formSystemDeleteFormCertificationType(input: $input)
  }
`
