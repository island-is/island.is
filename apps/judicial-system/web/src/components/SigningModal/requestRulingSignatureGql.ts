import { gql } from '@apollo/client'

const RequestRulingSignatureMutation = gql`
  mutation RequestRulingSignature($input: RequestSignatureInput!) {
    requestRulingSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export default RequestRulingSignatureMutation
