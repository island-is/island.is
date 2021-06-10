import gql from 'graphql-tag'

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
        invalidated
        bulkEndorsement
      }
      created
      modified
    }
  }
`
