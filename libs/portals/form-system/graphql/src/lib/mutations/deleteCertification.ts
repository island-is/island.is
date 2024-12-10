import { gql } from '@apollo/client'

export const DELETE_CERTIFICATION = gql`
  mutation FormSystemDeleteCertification($input: FormSystemDeleteCertificationInput!) {
    formSystemDeleteCertification(input: $input)
  }
`
