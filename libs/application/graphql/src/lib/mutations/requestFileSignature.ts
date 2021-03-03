import { gql } from '@apollo/client'

export const REQUEST_FILE_SIGNATURE = gql`
  mutation RequestFileSignature($input: RequestFileSignatureInput!) {
    requestFileSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`
