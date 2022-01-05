import { gql } from '@apollo/client'

export const GET_FILE_CONTENT_AS_BASE64 = gql`
  query GetFileContentAsBase64($input: FileContentAsBase64Input!) {
    getFileContentAsBase64(input: $input) {
      content
    }
  }
`
