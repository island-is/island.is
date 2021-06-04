import { gql } from '@apollo/client'

export const UPLOAD_SIGNED_FILE = gql`
  mutation UploadSignedFile($input: UploadSignedFileInput!) {
    uploadSignedFile(input: $input) {
      documentSigned
    }
  }
`
