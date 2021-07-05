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

export const BulkEndorse = gql`
  mutation endorsementSystemBulkEndorseList($input: BulkEndorseListInput!) {
    endorsementSystemBulkEndorseList(input: $input) {
      succeeded {
        id
        endorser
        endorsementListId
        meta {
          fullName
        }
        created
        modified
      }
      failed {
        nationalId
        message
      }
    }
  }
`
