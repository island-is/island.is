import { gql } from '@apollo/client'

export const RulingSignatureConfirmationQuery = gql`
  query RulingSignatureConfirmationQuery(
    $input: SignatureConfirmationQueryInput!
  ) {
    rulingSignatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`

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
  query CaseListQuery {
    cases {
      created
      courtDate
      isValidToDateInThePast
      initialRulingDate
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
  query AppealedCases {
    cases {
      defendants {
        name
      }
      appealState
      ...CoreCaseListFields
    }
  }
`

export const CreateUserMutation = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
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
  query UsersQuery {
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
  query UserQuery($input: UserQueryInput!) {
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
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      modified
    }
  }
`

export const InstitutionsQuery = gql`
  query InstitutionsQuery {
    institutions {
      id
      type
      name
    }
  }
`
