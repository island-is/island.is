import { gql } from '@apollo/client'

export const GET_FILE_UPLOAD_TAGS = gql`
  query GetFileUploadTags($filename: String!) {
    getFileUploadTags(filename: $filename) {
      key
      value
    }
  }
`