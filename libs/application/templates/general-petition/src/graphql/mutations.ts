import gql from 'graphql-tag'

export const EndorseList = gql`
  mutation endorsementSystemEndorseList($input: FindEndorsementListInput!) {
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
