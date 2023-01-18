import { gql } from '@apollo/client'

export const RulingSignatureConfirmationGql = gql`
  query RulingSignatureConfirmation($input: SignatureConfirmationQueryInput!) {
    rulingSignatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`

export const CasesGql = gql`
  query CaseList {
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

export const CreateUserGql = gql`
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

export const UsersGql = gql`
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

export const UserGql = gql`
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

export const UpdateUserGql = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      modified
    }
  }
`

export const InstitutionsGql = gql`
  query Institutions {
    institutions {
      id
      type
      name
    }
  }
`
