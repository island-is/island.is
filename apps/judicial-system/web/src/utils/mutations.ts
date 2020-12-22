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
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      requestedDefenderName
      requestedDefenderEmail
      court
      arrestDate
      requestedCourtDate
      alternativeTravelBan
      requestedCustodyEndDate
      lawsBroken
      custodyProvisions
      requestedCustodyRestrictions
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
      defenderName
      defenderEmail
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      accusedPlea
      litigationPresentations
      ruling
      decision
      custodyEndDate
      isCustodyEndDateInThePast
      custodyRestrictions
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      judge {
        name
        title
      }
    }
  }
`

export const CasesQuery = gql`
  query CasesQuery {
    cases {
      id
      created
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      isCourtDateInThePast
      custodyEndDate
      decision
      isCustodyEndDateInThePast
    }
  }
`
