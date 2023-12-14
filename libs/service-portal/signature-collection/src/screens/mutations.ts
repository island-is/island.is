import gql from 'graphql-tag'

export const CancelCollection = gql`
  mutation signatureCollectionCancel($input: SignatureCollectionIdInput!) {
    signatureCollectionCancel(input: $input) {
      success
    }
  }
`
