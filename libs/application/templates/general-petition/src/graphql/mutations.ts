import gql from 'graphql-tag'

export const EndorseList = gql`
  mutation endorsementSystemEndorseList($input: CreateEndorsementInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementListId
      meta {
        fullName
      }
      created
      modified
    }
  }
`
