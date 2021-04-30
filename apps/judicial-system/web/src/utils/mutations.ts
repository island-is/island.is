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
      sendRequestToDefender
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
      caseFilesComments
      prosecutor {
        name
        title
      }
      setCourtCaseNumberManually
      courtCaseNumber
      courtDate
      courtRoom
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      courtDocuments
      additionToConclusion
      accusedPleaDecision
      accusedPleaAnnouncement
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
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      judge {
        name
        title
      }
      registrar {
        name
        title
      }
      parentCase {
        id
      }
    }
  }
`

export const CreateCourtCaseMutation = gql`
  mutation CreateCourtCaseMutation($input: CreateCourtCaseInput!) {
    createCourtCase(input: $input) {
      courtCaseNumber
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
      custodyEndDate
      decision
      isCustodyEndDateInThePast
      courtCaseNumber
      rulingDate
      courtEndTime
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
      sendRequestToDefender
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
      caseFilesComments
      prosecutor {
        name
        title
      }
      setCourtCaseNumberManually
      courtCaseNumber
      courtDate
      courtRoom
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      courtDocuments
      additionToConclusion
      accusedPleaDecision
      accusedPleaAnnouncement
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
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
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
      institution {
        id
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
      name
    }
  }
`
