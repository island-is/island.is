import gql from 'graphql-tag'

export const DELETE_ICELANDIC_NAME_MUTATION = gql`
  mutation DeleteIcelandicNameMutation($input: DeleteIcelandicNameByIdInput!) {
    deleteIcelandicNameById(input: $input) {
      id
    }
  }
`
