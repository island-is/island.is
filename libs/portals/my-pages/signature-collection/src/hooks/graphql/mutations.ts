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
  mutation removeSignature($input: SignatureCollectionListIdWithTypeInput!) {
    signatureCollectionUnsign(input: $input) {
      success
      reasons
    }
  }
`
export const addConstituency = gql`
  mutation SignatureCollectionAddAreas(
    $inputAdd: SignatureCollectionAddListsInput!
  ) {
    signatureCollectionAddAreas(input: $inputAdd) {
      success
      reasons
    }
  }
`

export const uploadPaperSignature = gql`
  mutation SignatureCollectionUploadPaperSignature(
    $input: SignatureCollectionUploadPaperSignatureInput!
  ) {
    signatureCollectionUploadPaperSignature(input: $input) {
      success
      reasons
    }
  }
`
export const updatePaperSignaturePageNumber = gql`
  mutation SignatureCollectionUpdatePaperSignaturePageNumber(
    $input: SignatureCollectionSignatureUpdateInput!
  ) {
    signatureCollectionUpdatePaperSignaturePageNumber(input: $input) {
      success
    }
  }
`
