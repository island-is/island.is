import { gql } from '@apollo/client'

export const GET_PRESIGNED_URL = gql`
  query GetPresignedUrl($input: GetPresignedUrlInput!) {
    getPresignedUrl(input: $input) {
      url
    }
  }
`
