import { gql } from '@apollo/client'

const RequestRulingSignatureMutation = gql`
  mutation RequestRulingSignatureMutation($input: RequestSignatureInput!) {
    requestRulingSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export default RequestRulingSignatureMutation
