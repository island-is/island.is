import { gql } from '@apollo/client'

export const CreateCaseMutation = gql`
  mutation CreateCaseMutation($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      defendants {
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

export const ExtendCaseMutation = gql`
  mutation ExtendCaseMutation($input: ExtendCaseInput!) {
    extendCase(input: $input) {
      id
      type
    }
  }
`

export const LimitedAccessTransitionCaseMutation = gql`
  mutation LimitedAccessTransitionCaseMutation($input: TransitionCaseInput!) {
    limitedAccessTransitionCase(input: $input) {
      state
      appealState
    }
  }
`

export const RequestCourtRecordSignatureMutation = gql`
  mutation RequestCourtRecordSignatureMutation($input: RequestSignatureInput!) {
    requestCourtRecordSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export const SendNotificationMutation = gql`
  mutation SendNotificationMutation($input: SendNotificationInput!) {
    sendNotification(input: $input) {
      notificationSent
    }
  }
`

export const TransitionCaseMutation = gql`
  mutation TransitionCaseMutation($input: TransitionCaseInput!) {
    transitionCase(input: $input) {
      state
      appealState
    }
  }
`

export const UpdateCaseMutation = gql`
  mutation UpdateCaseMutation($input: UpdateCaseInput!) {
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
      }
      defenderName
      defenderNationalId
      defenderEmail
      defenderPhoneNumber
      sendRequestToDefender
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
          name
          size
          created
          state
          key
        }
      }
      childCase {
        id
      }
      notifications {
        type
      }
      caseFiles {
        id
        name
        size
        created
        modified
        state
        key
        category
        policeCaseNumber
        chapter
        orderWithinChapter
        userGeneratedFilename
        displayDate
      }
      isAppealDeadlineExpired
      isAppealGracePeriodExpired
      caseModifiedExplanation
      rulingModifiedHistory
      caseResentExplanation
      origin
      seenByDefender
      subpoenaType
      defendantWaivesRightToCounsel
      crimeScenes
      indictmentIntroduction
      requestDriversLicenseSuspension
      appealState
    }
  }
`
