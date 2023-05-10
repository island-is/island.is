import { gql } from '@apollo/client'

export const coreCaseListFields = gql`
  fragment CoreCaseListFields on CaseListEntry {
    id
    type
    decision
    state
    courtCaseNumber
    accusedAppealDecision
    prosecutorAppealDecision
    accusedPostponedAppealDate
    prosecutorPostponedAppealDate
    courtEndTime
    validToDate
    policeCaseNumbers
    parentCaseId
    defendants {
      id
      nationalId
      name
      noNationalId
    }
  }
`

export const CasesQuery = gql`
  ${coreCaseListFields}
  query CaseList {
    cases {
      created
      courtDate
      isValidToDateInThePast
      initialRulingDate
      rulingDate
      judge {
        id
      }
      prosecutor {
        id
      }
      registrar {
        id
      }
      creatingProsecutor {
        id
      }
      ...CoreCaseListFields
    }
  }
`

export const AppealedCasesQuery = gql`
  ${coreCaseListFields}
  query AppealedCases($input: CaseListQueryInput) {
    cases(input: $input) {
      defendants {
        name
      }
      appealState
      appealedDate
      ...CoreCaseListFields
    }
  }
`

export const CreateUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      nationalId
      mobileNumber
      role
      title
      email
      institution {
        id
        type
        name
      }
      active
    }
  }
`

export const UsersQuery = gql`
  query Users {
    users {
      id
      name
      nationalId
      mobileNumber
      role
      title
      email
      institution {
        id
        type
        name
      }
      active
    }
  }
`

export const UserQuery = gql`
  query User($input: UserQueryInput!) {
    user(input: $input) {
      id
      name
      nationalId
      mobileNumber
      role
      title
      email
      institution {
        id
        type
        name
      }
      active
    }
  }
`

export const UpdateUserMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      modified
    }
  }
`

export const InstitutionsQuery = gql`
  query Institutions {
    institutions {
      id
      type
      name
    }
  }
`
