import { gql } from '@apollo/client'

export const GET_APPLICATION_PDF = gql`
  query FormSystemApplicationPdf($input: FormSystemApplicationInput!) {
    formSystemApplicationPdf(input: $input) {
      base64
      filename
    }
  }
`
