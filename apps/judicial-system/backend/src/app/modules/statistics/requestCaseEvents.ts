import {
  AppealCaseRulingDecision,
  AppealEventType,
  CaseDecision,
  CaseOrigin,
  CaseType,
  courtSubtypes,
  EventType,
  prosecutionRoles,
} from '@island.is/judicial-system/types'

import { Case, EventLog } from '../repository'
import { RequestCaseEventType } from './models/event.model'

export interface RequestCaseEvent {
  id: string
  event: RequestCaseEventType
  eventDescriptor: string
  date: string
  institution?: string
  caseType: CaseType
  caseTypeDescriptor: string
  origin: CaseOrigin
  isExtended: string
  // event specific fields
  requestDecision?: CaseDecision
  requestDecisionDescriptor?: string
  courtOfAppealDecision?: AppealCaseRulingDecision
  courtOfAppealDecisionDescriptor?: string
  parentCaseId?: string
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
  const isExtendedCase = !!c.parentCaseId
  return {
    caseType: c.type,
    caseTypeDescriptor: getCaseTypeTranslation(c.type),
    origin: c.origin,
    isExtended: isExtendedCase ? 'Já' : 'Nei',
    requestDecision: c.decision,
    requestDecisionDescriptor: c.decision
      ? getDecisionDescriptor(c.decision)
      : '',
    courtOfAppealDecision: c.appealCase?.appealRulingDecision,
    courtOfAppealDecisionDescriptor: c.appealCase?.appealRulingDecision
      ? getAppealRulingDecisionDescriptor(c.appealCase?.appealRulingDecision)
      : '',
    parentCaseId: c.parentCaseId,
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
  appealRulingDecision: AppealCaseRulingDecision,
) => {
  switch (appealRulingDecision) {
    case AppealCaseRulingDecision.ACCEPTING: {
      return 'Staðfesting'
    }
    case AppealCaseRulingDecision.REPEAL: {
      return 'Fella úr gildi'
    }
    case AppealCaseRulingDecision.CHANGED: {
      return 'Niðurstöðu breytt'
    }
    case AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY: {
      return 'Niðurstöðu breytt að verulegu leyti'
    }
    case AppealCaseRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL: {
      return 'Frávísun frá Landsrétti'
    }
    case AppealCaseRulingDecision.DISMISSED_FROM_COURT: {
      return 'Frávísun frá héraðsdómi'
    }
    case AppealCaseRulingDecision.REMAND: {
      return 'Ómerking og heimvísun'
    }
    case AppealCaseRulingDecision.DISCONTINUED: {
      return 'Niðurfelling'
    }
    default: {
      return 'Óþekkt'
    }
  }
}

// R-CASES
const createCase = (c: Case): RequestCaseEvent => {
  const {
    event,
    eventDescriptor,
  }: { event: RequestCaseEventType; eventDescriptor: string } = !c.parentCaseId
    ? { event: 'CASE_CREATED', eventDescriptor: 'Krafa stofnuð' }
    : { event: 'REQUEST_EXTENDED', eventDescriptor: 'Krafa framlengd' }

  return {
    id: c.id,
    event,
    eventDescriptor,
    date: c.created.toISOString(),
    institution: c.prosecutorsOffice?.name,
    ...commonFields(c),
  }
}

const caseSentToCourt = (c: Case): RequestCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.CASE_SENT_TO_COURT,
    c.eventLogs,
  )?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'CASE_SENT_TO_COURT',
    eventDescriptor: 'Krafa send til héraðsdóms',
    date,
    institution: c.prosecutorsOffice?.name,
    ...commonFields(c),
  }
}

const caseReceivedByCourt = (c: Case): RequestCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.CASE_RECEIVED_BY_COURT,
    c.eventLogs,
  )?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'CASE_RECEIVED_BY_COURT',
    eventDescriptor: 'Krafa móttekin af héraðsdómi',
    date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const courtDateScheduled = (c: Case): RequestCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.COURT_DATE_SCHEDULED,
    c.eventLogs,
  )?.toISOString()

  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'COURT_DATE_SCHEDULED',
    eventDescriptor: 'Þinghald bókað',
    date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const courtSessionStarted = (c: Case): RequestCaseEvent | undefined => {
  const date = c.courtStartDate
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'COURT_SESSION_STARTED',
    eventDescriptor: 'Þinghald hófst',
    date: date.toISOString(),
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const courtSessionEnded = (c: Case): RequestCaseEvent | undefined => {
  const date = c.courtEndTime
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'COURT_SESSION_ENDED',
    eventDescriptor: 'Þinghaldi lauk',
    date: date.toISOString(),
    institution: c.court?.name,
    ...commonFields(c),
  }
}

// One REQUEST_APPEALED per appealing side, read from the APPEALED event log (the
// appellant source since the postponed-date columns were dropped). Each is dated
// by the appeal case's appeal date; the prosecution side keeps its office
// attribution.
const requestAppealed = (c: Case): RequestCaseEvent[] => {
  const appealDate = c.appealCase?.appealDate
  if (!appealDate) {
    return []
  }

  const appealedEvents = (c.appealCase?.appealEventLogs ?? []).filter(
    (eventLog) => eventLog.eventType === AppealEventType.APPEALED,
  )

  const date = appealDate.toISOString()
  const requestAppealedEvents: RequestCaseEvent[] = []

  if (appealedEvents.some((e) => prosecutionRoles.includes(e.userRole))) {
    requestAppealedEvents.push({
      id: c.id,
      event: 'REQUEST_APPEALED',
      eventDescriptor: 'Úrskurður kærður',
      date,
      institution: c.prosecutorsOffice?.name,
      ...commonFields(c),
    })
  }

  if (appealedEvents.some((e) => !prosecutionRoles.includes(e.userRole))) {
    requestAppealedEvents.push({
      id: c.id,
      event: 'REQUEST_APPEALED',
      eventDescriptor: 'Úrskurður kærður',
      date,
      ...commonFields(c),
    })
  }

  return requestAppealedEvents
}

const requestCompleted = (c: Case): RequestCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.REQUEST_COMPLETED,
    c.eventLogs,
  )?.toISOString()

  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'REQUEST_COMPLETED',
    eventDescriptor: 'Kröfu lokið',
    date: date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const caseReceivedByCourtOfAppeals = (
  c: Case,
): RequestCaseEvent | undefined => {
  const date = c.appealCase?.appealReceivedByCourtDate?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'CASE_RECEIVED_BY_COURT_OF_APPEALS',
    eventDescriptor: 'Kæra móttekin af Landsrétti',
    date,
    institution: 'Landsréttur',
    ...commonFields(c),
  }
}
const caseCompletedByCourtOfAppeals = (
  c: Case,
): RequestCaseEvent | undefined => {
  if (!c.appealCase?.appealRulingDate) {
    return undefined
  }

  return {
    id: c.id,
    event: 'CASE_COMPLETED_BY_COURT_OF_APPEALS',
    eventDescriptor: 'Kæru lokið',
    date: c.appealCase.appealRulingDate.toISOString(),
    institution: 'Landsréttur',
    ...commonFields(c),
  }
}

export const requestCaseEventFunctions = [
  createCase,
  caseSentToCourt,
  caseReceivedByCourt,
  courtDateScheduled,
  courtSessionStarted,
  courtSessionEnded,
  requestAppealed,
  requestCompleted,
  caseReceivedByCourtOfAppeals,
  caseCompletedByCourtOfAppeals,
]
