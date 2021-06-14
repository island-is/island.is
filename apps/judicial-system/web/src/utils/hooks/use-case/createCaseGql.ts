import { gql } from '@apollo/client'

export const CreateCaseMutation = gql`
  mutation CreateCaseMutation($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      created
      modified
      type
      description
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      defenderName
      defenderEmail
      defenderPhoneNumber
      sendRequestToDefender
      court {
        id
        type
        name
      }
      leadInvestigator
      arrestDate
      requestedCourtDate
      requestedValidToDate
      demands
      lawsBroken
      legalBasis
      custodyProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      legalArguments
      requestProsecutorOnlySession
      prosecutorOnlySessionRequest
      comments
      caseFilesComments
      prosecutor {
        name
        title
      }
      sharedWithProsecutorsOffice {
        id
        type
        name
      }
      courtCaseNumber
      courtDate
      courtRoom
      courtStartDate
      courtEndTime
      courtAttendees
      prosecutorDemands
      courtDocuments
      isAccusedAbsent
      accusedPleaDecision
      accusedPleaAnnouncement
      litigationPresentations
      courtCaseFacts
      courtLegalArguments
      ruling
      decision
      validToDate
      isValidToDateInThePast
      custodyRestrictions
      otherRestrictions
      isolationToDate
      additionToConclusion
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
