import { gql } from '@apollo/client'

export const ADD_ATTACHMENT = gql`
  mutation AddAttachment($input: AddAttachmentInput!) {
    addAttachment(input: $input) {
      attachments
    }
  }
`
