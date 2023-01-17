import { gql } from '@apollo/client'

const RequestRulingSignatureGql = gql`
  mutation RequestRulingSignature($input: RequestSignatureInput!) {
    requestRulingSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export default RequestRulingSignatureGql
