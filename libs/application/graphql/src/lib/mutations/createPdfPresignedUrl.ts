import { gql } from '@apollo/client'

export const CREATE_PDF_PRESIGNED_URL = gql`
  mutation CreatePdfPresignedUrl($input: CreatePdfInput!) {
    createPdfPresignedUrl(input: $input) {
      url
    }
  }
`
