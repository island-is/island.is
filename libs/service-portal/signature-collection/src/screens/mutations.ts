import gql from 'graphql-tag'

export const cancelCollectionMutation = gql`
  mutation signatureCollectionCancel($input: SignatureCollectionIdInput!) {
    signatureCollectionCancel(input: $input) {
      success
    }
  }
`
