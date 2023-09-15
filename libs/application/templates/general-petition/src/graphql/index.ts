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
      meta
      title
      description
      ownerName
      closedDate
      openedDate
      adminLock
      owner
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

export const GetSingleEndorsement = gql`
  query endorsementSystemGetSingleEndorsement(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsement(input: $input) {
      hasEndorsed
    }
  }
`

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
