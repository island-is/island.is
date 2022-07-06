import { gql } from '@apollo/client'

export const GET_ATTACHMENT_PRESIGNED_URL = gql`
  query GetAttachmentPresignedUrl($input: AttachmentPresignedUrlInput!) {
    attachmentPresignedURL(input: $input) {
      url
    }
  }
`
