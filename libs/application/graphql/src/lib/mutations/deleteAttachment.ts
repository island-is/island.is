import { gql } from '@apollo/client'

export const DELETE_ATTACHMENT = gql`
  mutation DeleteAttachment($input: DeleteAttachmentInput!) {
    deleteAttachment(input: $input) {
      attachments
    }
  }
`
