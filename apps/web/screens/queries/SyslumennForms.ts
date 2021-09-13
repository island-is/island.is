import gql from 'graphql-tag'

export const SYSLUMENN_FORMS_MUTATION = gql`
  mutation SyslumennForms($input: SyslumennFormsInput!) {
    syslumennForms(input: $input) {
      sent
    }
  }
`
