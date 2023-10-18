import { gql } from '@apollo/client'

export const CreateCaseMutation = gql`
  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      defendants {
        id
      }
    }
  }
`

export const CreateCourtCaseMutation = gql`
  mutation CreateCourtCase($input: CreateCourtCaseInput!) {
    createCourtCase(input: $input) {
      courtCaseNumber
    }
  }
`

export const ExtendCaseMutation = gql`
  mutation ExtendCase($input: ExtendCaseInput!) {
    extendCase(input: $input) {
      id
      type
    }
  }
`

export const SendNotificationMutation = gql`
  mutation SendNotification($input: SendNotificationInput!) {
    sendNotification(input: $input) {
      notificationSent
    }
  }
`

export const TransitionCaseMutation = gql`
  mutation TransitionCase($input: TransitionCaseInput!) {
    transitionCase(input: $input) {
      state
      appealState
      appealReceivedByCourtDate
      statementDeadline
    }
  }
`

export const LimitedAccessTransitionCaseMutation = gql`
  mutation LimitedAccessTransitionCase($input: TransitionCaseInput!) {
    limitedAccessTransitionCase(input: $input) {
      state
      appealState
      appealReceivedByCourtDate
    }
  }
`

export const UpdateCaseMutation = gql`
  mutation UpdateCase($input: UpdateCaseInput!) {
    updateCase(input: $input) {
      id
      created
      modified
      type
      indictmentSubtypes
      description
      state
      policeCaseNumbers
      defendants {
        id
        noNationalId
        nationalId
        name
        gender
        address
        citizenship
        defenderName
        defenderNationalId
        defenderEmail
        defenderPhoneNumber
        defendantWaivesRightToCounsel
      }
      defenderName
      defenderNationalId
      defenderEmail
      defenderPhoneNumber
      requestSharedWithDefender
      isHeightenedSecurityLevel
      court {
        id
        name
        type
      }
      leadInvestigator
      arrestDate
      requestedCourtDate
      translator
      requestedValidToDate
      demands
      lawsBroken
      legalBasis
      legalProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      legalArguments
      requestProsecutorOnlySession
      prosecutorOnlySessionRequest
      comments
      caseFilesComments
      creatingProsecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      prosecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      sharedWithProsecutorsOffice {
        id
        type
        name
      }
      courtCaseNumber
      sessionArrangements
      courtDate
      courtLocation
      courtRoom
      courtStartDate
      courtEndTime
      isClosedCourtHidden
      courtAttendees
      prosecutorDemands
      courtDocuments
      sessionBookings
      courtCaseFacts
      introduction
      courtLegalArguments
      ruling
      decision
      validToDate
      isValidToDateInThePast
      isCustodyIsolation
      isolationToDate
      conclusion
      endOfSessionBookings
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      rulingDate
      rulingSignatureDate
      judge {
        id
        name
        title
      }
      courtRecordSignatory {
        id
        name
        title
      }
      courtRecordSignatureDate
      registrar {
        id
        name
        title
      }
      parentCase {
        id
        state
        validToDate
        decision
        courtCaseNumber
        ruling
        caseFiles {
          id
          created
          name
          state
          key
          size
        }
      }
      childCase {
        id
      }
      notifications {
        created
        type
        recipients {
          success
        }
      }
      caseFiles {
        id
        created
        modified
        name
        type
        category
        state
        key
        size
        policeCaseNumber
        chapter
        orderWithinChapter
        userGeneratedFilename
        displayDate
        policeFileId
      }
      isAppealDeadlineExpired
      isAppealGracePeriodExpired
      caseModifiedExplanation
      rulingModifiedHistory
      caseResentExplanation
      origin
      openedByDefender
      defendantWaivesRightToCounsel
      crimeScenes
      indictmentIntroduction
      indictmentCounts {
        id
        caseId
        policeCaseNumber
        created
        modified
        vehicleRegistrationNumber
        offenses
        substances
        lawsBroken
        incidentDescription
        legalArguments
      }
      requestDriversLicenseSuspension
      appealState
      isStatementDeadlineExpired
      statementDeadline
      canBeAppealed
      hasBeenAppealed
      appealedByRole
      appealedDate
      appealDeadline
      prosecutorStatementDate
      defendantStatementDate
      appealReceivedByCourtDate
      appealCaseNumber
      appealAssistant {
        id
        name
      }
      appealJudge1 {
        id
        name
      }
      appealJudge2 {
        id
        name
      }
      appealJudge3 {
        id
        name
      }
      appealConclusion
      appealRulingDecision
    }
  }
`

export const LimitedAccessUpdateCaseMutation = gql`
  mutation LimitedAccessUpdateCase($input: UpdateCaseInput!) {
    limitedAccessUpdateCase(input: $input) {
      id
      created
      origin
      type
      indictmentSubtypes
      state
      policeCaseNumbers
      caseFiles {
        id
        created
        name
        category
        key
        policeCaseNumber
      }
      defendants {
        id
        noNationalId
        nationalId
        name
        gender
        address
        citizenship
        defenderName
        defenderNationalId
        defenderEmail
        defenderPhoneNumber
        defendantWaivesRightToCounsel
      }
      defenderName
      defenderNationalId
      defenderEmail
      defenderPhoneNumber
      requestSharedWithDefender
      court {
        id
        name
        type
      }
      leadInvestigator
      requestedCustodyRestrictions
      creatingProsecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      prosecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      courtCaseNumber
      courtEndTime
      validToDate
      decision
      isValidToDateInThePast
      isCustodyIsolation
      isolationToDate
      conclusion
      rulingDate
      rulingSignatureDate
      registrar {
        id
        name
        title
      }
      judge {
        id
        name
        title
      }
      courtRecordSignatory {
        id
        name
        title
      }
      courtRecordSignatureDate
      parentCase {
        id
        state
        validToDate
        decision
        courtCaseNumber
        ruling
      }
      childCase {
        id
      }
      caseModifiedExplanation
      caseResentExplanation
      appealState
      accusedAppealDecision
      prosecutorAppealDecision
      isAppealDeadlineExpired
      isStatementDeadlineExpired
      statementDeadline
      canBeAppealed
      hasBeenAppealed
      appealedByRole
      appealedDate
      appealDeadline
      prosecutorStatementDate
      defendantStatementDate
      appealReceivedByCourtDate
      appealCaseNumber
      appealAssistant {
        id
        name
      }
      appealJudge1 {
        id
        name
      }
      appealJudge2 {
        id
        name
      }
      appealJudge3 {
        id
        name
      }
      appealConclusion
      appealRulingDecision
    }
  }
`
