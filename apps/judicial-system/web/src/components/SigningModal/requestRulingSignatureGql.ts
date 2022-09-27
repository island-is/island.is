import { gql } from '@apollo/client'

export const RequestRulingSignatureMutation = gql`
  mutation RequestRulingSignatureMutation($input: RequestSignatureInput!) {
    requestRulingSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`
