import { gql } from '@apollo/client'

export const PUBLISH_FORM = gql`
  mutation PublishFormSystemForm($input: FormSystemPublishFormInput!) {
    publishFormSystemForm(input: $input)
  }
`
