import { gql } from '@apollo/client'

export const CaseQuery = gql`
  query CaseQuery($input: CaseQueryInput!) {
    case(input: $input) {
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
      rejecting
      custodyEndDate
      custodyRestrictions
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      judge {
        name
        title
      }
      notifications {
        type
      }
    }
  }
`

export const UpdateCaseMutation = gql`
  mutation UpdateCaseMutation($input: UpdateCaseInput!) {
    updateCase(input: $input) {
      id
      modified
    }
  }
`

export const TransitionCaseMutation = gql`
  mutation TransitionCaseMutation($input: TransitionCaseInput!) {
    transitionCase(input: $input) {
      id
      modified
      state
      prosecutor {
        name
        title
      }
      judge {
        name
        title
      }
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
