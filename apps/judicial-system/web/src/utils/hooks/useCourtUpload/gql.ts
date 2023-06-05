import { gql } from '@apollo/client'

export const UploadFileToCourtMutation = gql`
  mutation UploadFileToCourt($input: UploadFileToCourtInput!) {
    uploadFileToCourt(input: $input) {
      success
    }
  }
`
