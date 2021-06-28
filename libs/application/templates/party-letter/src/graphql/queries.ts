import gql from 'graphql-tag'

export const GetUserEndorsements = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      endorsementListId
    }
  }
`

export const GetSingleEndorsementList = gql`
  query endorsementSystemGetSingleEndorsementList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsementList(input: $input) {
      closedDate
    }
  }
`

export const GetFullName = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      fullName
    }
  }
`

export const GetEndorsements = gql`
  query endorsementSystemGetEndorsements($input: FindEndorsementListInput!) {
    endorsementSystemGetEndorsements(input: $input) {
      id
      endorser
      meta {
        fullName
        address
        bulkEndorsement
        voterRegion
      }
      created
      modified
    }
  }
`
