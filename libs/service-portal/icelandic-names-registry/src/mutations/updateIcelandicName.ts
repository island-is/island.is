import gql from 'graphql-tag'

export const UPDATE_ICELANDIC_NAME_MUTATION = gql`
  mutation UpdateIcelandicNameMutation($input: UpdateIcelandicNameInput!) {
    updateIcelandicNameById(input: $input) {
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
