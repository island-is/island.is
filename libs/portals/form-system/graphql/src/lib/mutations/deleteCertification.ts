import { gql } from '@apollo/client'

export const DELETE_CERTIFICATION = gql`
  mutation DeleteFormSystemCertification(
    $input: FormSystemDeleteCertificationInput!
  ) {
    deleteFormSystemCertification(input: $input)
  }
`
