import { gql } from '@apollo/client'

export const RequestCourtRecordSignatureMutation = gql`
  mutation RequestCourtRecordSignatureMutation($input: RequestSignatureInput!) {
    requestCourtRecordSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`
