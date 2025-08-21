import { option } from 'fp-ts'
import { filterMap } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseType,
  EventType,
  ServiceStatus,
} from '@island.is/judicial-system/types'

// TODO: fix barrel files
import { Case } from '../case'
import { courtSubtypes } from '../court/court.service'
import { EventLog } from '../event-log'
import {
  IndictmentCaseEventType,
  RequestCaseEventType,
} from './models/event.model'

export interface IndictmentCaseEvent {
  id: string
  event: IndictmentCaseEventType
  eventDescriptor: string
  date: string
  institution?: string
  caseType: CaseType
  caseTypeDescriptor: string
  origin: CaseOrigin
  caseSubtypes?: string
  caseSubtypeDescriptors?: string
  // for subpoena events
  defendantId?: string
  serviceStatus?: string
  serviceStatusDescriptor?: string
  // ruling related
  rulingDate?: string
  rulingDecision?: string
  rulingDecisionDescriptor?: string
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

const getServiceStatusDescriptor = (successStatus: ServiceStatus) => {
  switch (successStatus) {
    case ServiceStatus.ELECTRONICALLY: {
      return 'Birt í pósthólfi island.is'
    }
    case ServiceStatus.IN_PERSON: {
      return 'Birt varnaraðila'
    }
    case ServiceStatus.DEFENDER: {
      return 'Birt fyrir verjanda'
    }
    default: {
      return 'Óþekkt'
    }
  }
}

const getRulingDecisionDescriptor = (
  decision: CaseIndictmentRulingDecision,
) => {
  switch (decision) {
    case CaseIndictmentRulingDecision.RULING: {
      return 'Dómur'
    }
    case CaseIndictmentRulingDecision.FINE: {
      return 'Viðurlagaákvörðun'
    }
    case CaseIndictmentRulingDecision.DISMISSAL: {
      return 'Frávísun'
    }
    case CaseIndictmentRulingDecision.CANCELLATION: {
      return 'Niðurfelling máls'
    }
    case CaseIndictmentRulingDecision.MERGE: {
      return 'Sameinað öðru máli'
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

const caseSentToCourt = (c: Case): IndictmentCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.INDICTMENT_CONFIRMED,
    c.eventLogs,
  )?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'CASE_SENT_TO_COURT',
    eventDescriptor: 'Ákæra send til héraðsdóms',
    date,
    institution: c.prosecutorsOffice?.name,
    ...commonFields(c),
  }
}

const caseReceivedByCourt = (c: Case): IndictmentCaseEvent | undefined => {
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
    eventDescriptor: 'Ákæra móttekin af héraðsdómi',
    date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const courtDatesScheduled = (c: Case): IndictmentCaseEvent[] | undefined => {
  // we can have many court dates scheduled
  const events = EventLog.getAllEventLogsByEventType(
    EventType.COURT_DATE_SCHEDULED,
    c.eventLogs,
  )

  if (!events) {
    return undefined
  }

  return events.map(({ created }) => ({
    id: c.id,
    event: 'COURT_DATE_SCHEDULED',
    eventDescriptor: 'Fyrirtökutíma úthlutað',
    date: created.toISOString(),
    institution: c.court?.name,
    ...commonFields(c),
  }))
}

const subpoenaServedToDefendant = (
  c: Case,
): IndictmentCaseEvent[] | undefined => {
  const subpoenas = pipe(
    c.defendants ?? [],
    filterMap((defendant) => {
      const subpoena = defendant.subpoenas?.find(
        (subpoena) => subpoena.serviceDate,
      )

      if (!subpoena || !subpoena.serviceDate || !subpoena.serviceStatus)
        return option.none

      return option.some({
        defendantId: defendant.id,
        date: subpoena.serviceDate,
        serviceStatus: subpoena.serviceStatus,
      })
    }),
  )

  if (subpoenas.length === 0) {
    return undefined
  }

  return subpoenas.map((subpoena) => ({
    id: c.id,
    event: 'SUBPOENA_SERVED',
    eventDescriptor: 'Ákæra birt varnaraðila',
    date: subpoena.date.toISOString(),
    institution: c.court?.name,
    defendantId: subpoena.defendantId,
    serviceStatus: subpoena.serviceStatus,
    serviceStatusDescriptor: getServiceStatusDescriptor(subpoena.serviceStatus),
    ...commonFields(c),
  }))
}

const caseRulingDecisionConfirmed = (
  c: Case,
): IndictmentCaseEvent | undefined => {
  const date = c.rulingDate
  const ruling = c.indictmentRulingDecision
  if (!date || !ruling) {
    return undefined
  }

  return {
    id: c.id,
    event: 'RULING_DECISION_CONFIRMED',
    eventDescriptor: 'Lyktir kveðnar upp',
    date: date.toISOString(),
    institution: c.court?.name,
    ...commonFields(c),
    rulingDecision: ruling,
    rulingDecisionDescriptor: getRulingDecisionDescriptor(ruling),
  }
}

const verdictServedToDefendant = (
  c: Case,
): IndictmentCaseEvent[] | undefined => {
  const verdicts = pipe(
    c.defendants ?? [],
    filterMap((defendant) => {
      const verdict = defendant.verdict

      if (!verdict || !verdict.serviceDate || !verdict.serviceStatus)
        return option.none

      return option.some({
        defendantId: defendant.id,
        date: verdict.serviceDate,
        serviceStatus: verdict.serviceStatus,
      })
    }),
  )

  if (verdicts.length === 0) {
    return undefined
  }

  return verdicts.map((verdict) => ({
    id: c.id,
    event: 'VERDICT_SERVED',
    eventDescriptor: 'Dómur birtur dómfellda',
    date: verdict.date.toISOString(),
    institution: c.court?.name,
    defendantId: verdict.defendantId,
    serviceStatus: verdict.serviceStatus,
    serviceStatusDescriptor: getServiceStatusDescriptor(verdict.serviceStatus),
    ...commonFields(c),
  }))
}

export const indictmentCaseEventFunctions = [
  createCase,
  caseSentToCourt,
  caseReceivedByCourt,
  courtDatesScheduled,
  subpoenaServedToDefendant,
  caseRulingDecisionConfirmed,
  verdictServedToDefendant,
]
