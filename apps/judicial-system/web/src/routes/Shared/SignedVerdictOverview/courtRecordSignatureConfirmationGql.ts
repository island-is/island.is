import { gql } from '@apollo/client'

export const CourtRecordSignatureConfirmationQuery = gql`
  query CourtRecordSignatureConfirmation(
    $input: SignatureConfirmationQueryInput!
  ) {
    courtRecordSignatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`
