import { gql } from '@apollo/client'

export const CourtRecordSignatureConfirmationQuery = gql`
  query CourtRecordSignatureConfirmationQuery(
    $input: SignatureConfirmationQueryInput!
  ) {
    courtRecordSignatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`
