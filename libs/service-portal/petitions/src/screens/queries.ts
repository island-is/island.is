import gql from 'graphql-tag'

export const GetSingleEndorsement = gql`
  query endorsementSystemGetSingleEndorsement(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsement(input: $input) {
      hasEndorsed
    }
  }
`

export const GetListsUserSigned = gql`
  query endorsementSystemUserEndorsements($input: EndorsementPaginationInput!) {
    endorsementSystemUserEndorsements(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        endorser
        endorsementList {
          id
          title
          description
          tags
          closedDate
          openedDate
        }
        meta {
          fullName
        }
        created
        modified
      }
    }
  }
`

export const GetAllEndorsementsLists = gql`
  query endorsementSystemFindEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemFindEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
        openedDate
        adminLock
        owner
      }
    }
  }
`

export const GetSinglePetitionList = gql`
  query endorsementSystemGetSingleEndorsementList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsementList(input: $input) {
      meta
      title
      description
      owner
      ownerName
      closedDate
      openedDate
      adminLock
      owner
    }
  }
`

export const GetEndorsements = gql`
  query endorsementSystemGetEndorsements($input: PaginatedEndorsementInput!) {
    endorsementSystemGetEndorsements(input: $input) {
      totalCount
      data {
        id
        endorser
        created
        meta {
          fullName
          locality
        }
      }
    }
  }
`

export const UnendorseList = gql`
  mutation unendorseList($input: FindEndorsementListInput!) {
    endorsementSystemUnendorseList(input: $input)
  }
`

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

export const EndorsementListsUserOwns = gql`
  query endorsementSystemUserEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemUserEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
        openedDate
      }
    }
  }
`

export const CloseList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemCloseEndorsementList(input: $input) {
      id
      title
      modified
      closedDate
      openedDate
    }
  }
`

export const OpenList = gql`
  mutation Mutants($input: OpenListInput!) {
    endorsementSystemOpenEndorsementList(input: $input) {
      id
    }
  }
`

export const LockList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemLockEndorsementList(input: $input) {
      id
    }
  }
`

export const UnlockList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemUnlockEndorsementList(input: $input) {
      id
    }
  }
`

export const UpdateList = gql`
  mutation Mutants($input: UpdateEndorsementListInput!) {
    endorsementSystemUpdateEndorsementList(input: $input) {
      id
    }
  }
`
