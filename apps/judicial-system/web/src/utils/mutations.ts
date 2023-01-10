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

export const CasesQuery = gql`
  query CaseListQuery {
    cases {
      id
      created
      courtDate
      policeCaseNumbers
      state
      type
      defendants {
        id
        nationalId
        name
        noNationalId
      }
      courtCaseNumber
      decision
      validToDate
      isValidToDateInThePast
      initialRulingDate
      rulingDate
      courtEndTime
      prosecutorAppealDecision
      accusedAppealDecision
      prosecutorPostponedAppealDate
      accusedPostponedAppealDate
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
      parentCaseId
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
