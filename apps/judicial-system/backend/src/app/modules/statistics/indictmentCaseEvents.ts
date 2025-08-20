import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseOrigin,
  CaseType,
  EventType,
  NotificationType,
} from '@island.is/judicial-system/types'

import { Case } from '../case'
import { courtSubtypes } from '../court/court.service'
import { EventLog } from '../event-log'
import { RequestCaseEventType } from './models/event.model'

export interface IndictmentCaseEvent {
  id: string
  event: RequestCaseEventType
  eventDescriptor: string
  date: string
  institution?: string
  caseType: CaseType
  caseTypeDescriptor: string
  origin: CaseOrigin
  caseSubtypes?: string
  caseSubtypeDescriptors?: string
}

// utility functions
const getCaseTypeTranslation = (caseType: CaseType) => {
  if (caseType === CaseType.INDICTMENT) {
    return 'Ákæra'
  }
  const subtypes = courtSubtypes[caseType]
  return Array.isArray(subtypes) ? subtypes[0] : subtypes
}

const commonFields = (c: Case) => {
  return {
    caseType: c.type,
    caseTypeDescriptor: getCaseTypeTranslation(c.type),
    origin: c.origin,
  }
}

const getDecisionDescriptor = (decision: CaseDecision) => {
  switch (decision) {
    case CaseDecision.ACCEPTING: {
      return 'Krafa samþykkt'
    }
    case CaseDecision.REJECTING: {
      return 'Kröfu hafnað'
    }
    case CaseDecision.ACCEPTING_PARTIALLY: {
      return 'Krafa tekin til greina að hluta'
    }
    case CaseDecision.DISMISSING: {
      return 'Kröfu vísað frá'
    }
    case CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN: {
      return 'Kröfu hafnað en úrskurðað í farbann'
    }
    default: {
      return 'Óþekkt'
    }
  }
}

const getAppealRulingDecisionDescriptor = (
  appealRulingDecision: CaseAppealRulingDecision,
) => {
  switch (appealRulingDecision) {
    case CaseAppealRulingDecision.ACCEPTING: {
      return 'Staðfesting'
    }
    case CaseAppealRulingDecision.REPEAL: {
      return 'Fella úr gildi'
    }
    case CaseAppealRulingDecision.CHANGED: {
      return 'Niðurstöðu breytt'
    }
    case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY: {
      return 'Niðurstöðu breytt að verulegu leyti'
    }
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL: {
      return 'Frávísun frá Landsrétti'
    }
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT: {
      return 'Frávísun frá héraðsdómi'
    }
    case CaseAppealRulingDecision.REMAND: {
      return 'Ómerking og heimvísun'
    }
    case CaseAppealRulingDecision.DISCONTINUED: {
      return 'Niðurfelling'
    }
    default: {
      return 'Óþekkt'
    }
  }
}

// S-CASES
const createCase = (c: Case): IndictmentCaseEvent => {
  const {
    event,
    eventDescriptor,
  }: { event: RequestCaseEventType; eventDescriptor: string } = {
    event: 'CASE_CREATED',
    eventDescriptor: 'Mál stofnað',
  }

  return {
    id: c.id,
    event,
    eventDescriptor,
    date: c.created.toISOString(),
    institution: c.prosecutorsOffice?.name,
    ...commonFields(c),
  }
}

// const caseSentToCourt = (c: Case): RequestCaseEvent | undefined => {
//   const date = EventLog.getEventLogDateByEventType(
//     EventType.CASE_SENT_TO_COURT,
//     c.eventLogs,
//   )?.toISOString()
//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'CASE_SENT_TO_COURT',
//     eventDescriptor: 'Krafa send til héraðsdóms',
//     date,
//     institution: c.prosecutorsOffice?.name,
//     ...commonFields(c),
//   }
// }

// const caseReceivedByCourt = (c: Case): RequestCaseEvent | undefined => {
//   const date = EventLog.getEventLogDateByEventType(
//     EventType.CASE_RECEIVED_BY_COURT,
//     c.eventLogs,
//   )?.toISOString()
//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'CASE_RECEIVED_BY_COURT',
//     eventDescriptor: 'Krafa móttekin af héraðsdómi',
//     date,
//     institution: c.prosecutorsOffice?.name,
//     ...commonFields(c),
//   }
// }

// const courtDateScheduled = (c: Case): RequestCaseEvent | undefined => {
//   const date = EventLog.getEventLogDateByEventType(
//     EventType.COURT_DATE_SCHEDULED,
//     c.eventLogs,
//   )?.toISOString()

//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'COURT_DATE_SCHEDULED',
//     eventDescriptor: 'Þinghald bókað',
//     date,
//     institution: c.court?.name,
//     ...commonFields(c),
//   }
// }

// const courtSessionStarted = (c: Case): RequestCaseEvent | undefined => {
//   const date = c.courtStartDate
//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'COURT_SESSION_STARTED',
//     eventDescriptor: 'Þinghald hófst',
//     date: date.toISOString(),
//     institution: c.court?.name,
//     ...commonFields(c),
//   }
// }

// const courtSessionEnded = (c: Case): RequestCaseEvent | undefined => {
//   const date = c.courtEndTime
//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'COURT_SESSION_ENDED',
//     eventDescriptor: 'Þinghaldi lauk',
//     date: date.toISOString(),
//     institution: c.court?.name,
//     ...commonFields(c),
//   }
// }

// const requestAppealed = (c: Case): RequestCaseEvent[] => {
//   const { prosecutorPostponedAppealDate, accusedPostponedAppealDate } = c

//   const requestAppealedEvents: RequestCaseEvent[] = []
//   if (prosecutorPostponedAppealDate) {
//     requestAppealedEvents.push({
//       id: c.id,
//       event: 'REQUEST_APPEALED',
//       eventDescriptor: 'Úrskurður kærður',
//       date: prosecutorPostponedAppealDate.toISOString(),
//       institution: c.prosecutorsOffice?.name,
//       ...commonFields(c),
//     })
//   }

//   if (accusedPostponedAppealDate) {
//     requestAppealedEvents.push({
//       id: c.id,
//       event: 'REQUEST_APPEALED',
//       eventDescriptor: 'Úrskurður kærður',
//       date: accusedPostponedAppealDate.toISOString(),
//       ...commonFields(c),
//     })
//   }

//   return requestAppealedEvents
// }

// const requestCompleted = (c: Case): RequestCaseEvent | undefined => {
//   const date = EventLog.getEventLogDateByEventType(
//     EventType.REQUEST_COMPLETED,
//     c.eventLogs,
//   )?.toISOString()

//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'REQUEST_COMPLETED',
//     eventDescriptor: 'Kröfu lokið',
//     date: date,
//     institution: c.court?.name,
//     ...commonFields(c),
//   }
// }

// const caseReceivedByCourtOfAppeals = (
//   c: Case,
// ): RequestCaseEvent | undefined => {
//   const date = c.appealReceivedByCourtDate?.toISOString()
//   if (!date) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'CASE_RECEIVED_BY_COURT_OF_APPEALS',
//     eventDescriptor: 'Kæra móttekin af Landsrétti',
//     date,
//     institution: 'Landsréttur',
//     ...commonFields(c),
//   }
// }
// const caseCompletedByCourtOfAppeals = (
//   c: Case,
// ): RequestCaseEvent | undefined => {
//   const completedByCourtOfAppealsNotification = c.notifications?.find(
//     (notification) => notification.type === NotificationType.APPEAL_COMPLETED,
//   )

//   if (!completedByCourtOfAppealsNotification) {
//     return undefined
//   }

//   return {
//     id: c.id,
//     event: 'CASE_COMPLETED_BY_COURT_OF_APPEALS',
//     eventDescriptor: 'Kæru lokið',
//     date: completedByCourtOfAppealsNotification.created.toISOString(),
//     institution: 'Landsréttur',
//     ...commonFields(c),
//   }
// }

export const indictmentCaseEventFunctions = [
  createCase,
  //   caseSentToCourt,
  //   caseReceivedByCourt,
  //   courtDateScheduled,
  //   courtSessionStarted,
  //   courtSessionEnded,
  //   requestAppealed,
  //   requestCompleted,
  //   caseReceivedByCourtOfAppeals,
  //   caseCompletedByCourtOfAppeals,
]
