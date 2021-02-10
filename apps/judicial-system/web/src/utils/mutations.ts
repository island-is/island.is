import { gql } from '@apollo/client'

export const RequestSignatureMutation = gql`
  mutation RequestSignatureMutation($input: RequestSignatureInput!) {
    requestSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export const SignatureConfirmationQuery = gql`
  query SignatureConfirmationQuery($input: SignatureConfirmationQueryInput!) {
    signatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`

export const CreateCaseMutation = gql`
  mutation CreateCaseMutation($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      created
      modified
      type
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      defenderName
      defenderEmail
      court
      arrestDate
      requestedCourtDate
      requestedCustodyEndDate
      otherDemands
      lawsBroken
      custodyProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      witnessAccounts
      investigationProgress
      legalArguments
      comments
      prosecutor {
        name
        title
      }
      courtCaseNumber
      courtDate
      isCourtDateInThePast
      courtRoom
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      courtDocuments
      accusedPlea
      litigationPresentations
      ruling
      decision
      custodyEndDate
      isCustodyEndDateInThePast
      custodyRestrictions
      otherRestrictions
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      judge {
        name
        title
      }
      parentCase {
        id
      }
    }
  }
`

export const CasesQuery = gql`
  query CasesQuery {
    cases {
      id
      created
      type
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      isCourtDateInThePast
      custodyEndDate
      decision
      isCustodyEndDateInThePast
      parentCase {
        id
      }
    }
  }
`

export const ExtendCaseMutation = gql`
  mutation ExtendCaseMutation($input: ExtendCaseInput!) {
    extendCase(input: $input) {
      id
      created
      modified
      type
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      defenderName
      defenderEmail
      court
      arrestDate
      requestedCourtDate
      requestedCustodyEndDate
      otherDemands
      lawsBroken
      custodyProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      witnessAccounts
      investigationProgress
      legalArguments
      comments
      prosecutor {
        name
        title
      }
      courtCaseNumber
      courtDate
      isCourtDateInThePast
      courtRoom
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      courtDocuments
      accusedPlea
      litigationPresentations
      ruling
      decision
      custodyEndDate
      isCustodyEndDateInThePast
      custodyRestrictions
      otherRestrictions
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      judge {
        name
        title
      }
      parentCase {
        id
      }
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
      institution
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
      institution
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
