import gql from 'graphql-tag'

export const cancelCollectionMutation = gql`
  mutation signatureCollectionCancel(
    $input: SignatureCollectionCancelListsInput!
  ) {
    signatureCollectionCancel(input: $input) {
      success
    }
  }
`

export const unSignList = gql`
  mutation removeSignature($input: SignatureCollectionListIdInput!) {
    signatureCollectionUnsign(input: $input) {
      success
      reasons
    }
  }
`
