import { gql } from '@apollo/client'

export const GET_ATTACHMENT_TAGS = gql`
  query GetAttachmentTags($url: String!) {
    getAttachmentTags(url: $url) {
      Key
      Value
    }
  }
`