import { gql } from '@apollo/client'

export const CREATE_FORM_URL = gql`
  mutation CreateFormSystemFormUrl($input: FormSystemFormUrlInput!) {
    createFormSystemFormUrl(input: $input) {
      formId
      organizationUrlId
    }
  }
`
