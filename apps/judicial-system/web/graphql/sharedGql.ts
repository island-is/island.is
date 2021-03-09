import { gql } from '@apollo/client'

export const CaseQuery = gql`
  query CaseQuery($input: CaseQueryInput!) {
    case(input: $input) {
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
      prosecutor {
        id
        name
        title
        institution {
          name
        }
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
      judge {
        id
        name
        title
      }
      registrar {
        id
        name
        title
      }
      parentCase {
        id
        custodyEndDate
        decision
        courtCaseNumber
      }
      childCase {
        id
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
