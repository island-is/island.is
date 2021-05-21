import { gql } from '@apollo/client'

export const GENERATE_PDF_PRESIGNED_URL = gql`
  mutation GeneratePdfPresignedUrl($input: GeneratePdfInput!) {
    generatePdfPresignedUrl(input: $input) {
      url
    }
  }
`
