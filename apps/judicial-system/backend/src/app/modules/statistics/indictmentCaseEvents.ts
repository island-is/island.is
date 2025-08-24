import { option } from 'fp-ts'
import { filterMap } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

import {
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseType,
  DefendantEventType,
  EventType,
  InstitutionType,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import { Case } from '../case'
import { courtSubtypes } from '../court'
import { DefendantEventLog } from '../defendant'
import { EventLog } from '../event-log'
import { Institution } from '../institution'
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

const caseCompletedAtCourt = (c: Case): IndictmentCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.INDICTMENT_COMPLETED,
    c.eventLogs,
  )?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'INDICTMENT_COMPLETED',
    eventDescriptor: 'Málið lokið hjá héraðsómi',
    date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const verdictServedToDefendant = (
  c: Case,
): IndictmentCaseEvent[] | undefined => {
  return pipe(
    c.defendants ?? [],
    filterMap((defendant) => {
      const verdict = defendant.verdict

      if (!verdict || !verdict.serviceDate || !verdict.serviceStatus)
        return option.none

      return option.some({
        id: c.id,
        defendantId: defendant.id,
        date: verdict.serviceDate.toISOString(),
        serviceStatus: verdict.serviceStatus,
        serviceStatusDescriptor: getServiceStatusDescriptor(
          verdict.serviceStatus,
        ),
        event: 'VERDICT_SERVED',
        eventDescriptor: 'Dómur birtur dómfellda',
        institution: c.court?.name,
        ...commonFields(c),
      })
    }),
  )
}

const caseSentToPublicProsecutorOffice = (
  c: Case,
): IndictmentCaseEvent | undefined => {
  const date = EventLog.getEventLogDateByEventType(
    EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    c.eventLogs,
  )?.toISOString()
  if (!date) {
    return undefined
  }

  return {
    id: c.id,
    event: 'INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR',
    eventDescriptor: 'Mál sent til Skrifstofu Ríkissaksóknara',
    date,
    institution: c.court?.name,
    ...commonFields(c),
  }
}

const caseReviewedByPublicProsecutorOffice = (
  c: Case,
  institution: Institution[],
): IndictmentCaseEvent | undefined => {
  const publicProsecutorOffice = institution.find(
    (institution) =>
      institution.type === InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )

  const date = EventLog.getEventLogDateByEventType(
    EventType.INDICTMENT_REVIEWED,
    c.eventLogs,
  )?.toISOString()
  if (!date || !publicProsecutorOffice) {
    return undefined
  }

  return {
    id: c.id,
    event: 'INDICTMENT_REVIEWED_BY_PUBLIC_PROSECUTOR',
    eventDescriptor: 'Ákvörðun tekin hjá Ríkissaksóknara',
    date,
    institution: publicProsecutorOffice.name,
    ...commonFields(c),
  }
}

const caseSentToPrisonAdmin = (
  c: Case,
  institution: Institution[],
): IndictmentCaseEvent[] | undefined => {
  const publicProsecutorOffice = institution.find(
    (institution) =>
      institution.type === InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
  if (!publicProsecutorOffice) return undefined

  return pipe(
    c.defendants ?? [],
    filterMap((defendant) => {
      const defendantEventLogs = defendant.eventLogs

      const date = DefendantEventLog.getEventLogDateByEventType(
        DefendantEventType.SENT_TO_PRISON_ADMIN,
        defendantEventLogs,
      )
      if (!date) return option.none

      return option.some({
        id: c.id,
        defendantId: defendant.id,
        date: date.toISOString(),
        event: 'CASE_SENT_TO_PRISON_ADMIN',
        eventDescriptor: 'Mál sent til fullnustu',
        institution: publicProsecutorOffice.name,
        ...commonFields(c),
      })
    }),
  )
}

const caseReceivedByPrisonAdmin = (
  c: Case,
  institution: Institution[],
): IndictmentCaseEvent[] | undefined => {
  const prisonAdmin = institution.find(
    (institution) => institution.type === InstitutionType.PRISON_ADMIN,
  )
  if (!prisonAdmin) return undefined

  return pipe(
    c.defendants ?? [],
    filterMap((defendant) => {
      const defendantEventLogs = defendant.eventLogs

      const date = DefendantEventLog.getEventLogDateByEventType(
        DefendantEventType.OPENED_BY_PRISON_ADMIN,
        defendantEventLogs,
      )
      if (!date) return option.none

      return option.some({
        id: c.id,
        defendantId: defendant.id,
        date: date.toISOString(),
        event: 'CASE_RECEIVED_BY_PRISON_ADMIN',
        eventDescriptor: 'Mál móttekið af fangelsisyfirvöldum',
        institution: prisonAdmin?.name,
        ...commonFields(c),
      })
    }),
  )
}

export const indictmentCaseEventFunctions = [
  createCase,
  caseSentToCourt,
  caseReceivedByCourt,
  courtDatesScheduled,
  subpoenaServedToDefendant,
  caseRulingDecisionConfirmed,
  verdictServedToDefendant,
  caseCompletedAtCourt,
  caseSentToPublicProsecutorOffice,
  caseReviewedByPublicProsecutorOffice,
  caseSentToPrisonAdmin,
  caseReceivedByPrisonAdmin,
]
