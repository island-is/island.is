import gql from 'graphql-tag'

export const cancelCollectionMutation = gql`
  mutation signatureCollectionCancel($input: SignatureCollectionIdInput!) {
    signatureCollectionCancel(input: $input) {
      success
    }
  }
`

export const unSignList = gql`
  mutation removeSignature($input: SignatureCollectionIdInput!) {
    signatureCollectionUnsign(input: $input) {
      success
      reasons
    }
  }
`
