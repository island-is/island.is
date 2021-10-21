import gql from 'graphql-tag'

export const SERVICE_WEB_FORMS_MUTATION = gql`
  mutation ServiceWebForms($input: ServiceWebFormsInput!) {
    serviceWebForms(input: $input) {
      sent
    }
  }
`
