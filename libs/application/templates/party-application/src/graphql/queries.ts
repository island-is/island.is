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
      }
      created
      modified
    }
  }
`

export const GetVoterRegion = gql`
  query getVoterRegion {
    temporaryVoterRegistryGetVoterRegion {
      regionNumber
      regionName
    }
  }
`