import { gql } from '@apollo/client'

export const CREATE_UPLOAD_URL = gql`
  mutation CreateUploadUrl($filename: String!) {
    createUploadUrl(filename: $filename) {
      url
      fields
    }
  }
`
