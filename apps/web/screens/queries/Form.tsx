import gql from 'graphql-tag'

export const GENERIC_FORM_MUTATION = gql`
  mutation GenericForm($input: GenericFormInput!) {
    genericForm(input: $input) {
      sent
    }
  }
`
