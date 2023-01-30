import { gql } from '@apollo/client'

export const GET_ICELANDIC_NAME_BY_SEARCH = gql`
  query GetIcelandicNameBySearch($input: GetIcelandicNameBySearchInput!) {
    getIcelandicNameBySearch(input: $input) {
      id
      icelandicName
      type
      status
      verdict
      visible
      description
      url
    }
  }
`
