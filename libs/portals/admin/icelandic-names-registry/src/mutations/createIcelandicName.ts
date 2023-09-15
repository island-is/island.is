import gql from 'graphql-tag'

export const CREATE_ICELANDIC_NAME_MUTATION = gql`
  mutation CreateIcelandicNameMutation($input: CreateIcelandicNameInput!) {
    createIcelandicName(input: $input) {
      id
      icelandicName
      type
      status
      description
      url
      verdict
      visible
    }
  }
`
