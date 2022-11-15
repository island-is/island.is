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
  query CasesQuery {
    cases {
      id
      created
      modified
      type
      indictmentSubType
      state
      policeCaseNumbers
      defendants {
        id
        nationalId
        name
        noNationalId
      }
      validToDate
      decision
      isValidToDateInThePast
      courtCaseNumber
      courtDate
      rulingDate
      courtEndTime
      accusedAppealDecision
      prosecutorAppealDecision
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      parentCase {
        id
      }
      initialRulingDate
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
