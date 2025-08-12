import { CaseOrigin, CaseType } from '@island.is/judicial-system/types'

import { Case } from '../case'
import { courtSubtypes } from '../court/court.service'
import { RequestCaseEventType } from './models/event.model'

interface RequestCaseEvent {
  id: string
  event: RequestCaseEventType
  eventDescriptor: string
  date: string
  institution?: string
  caseSubtype: CaseType
  caseSubtypeDescriptor: string
  origin: CaseOrigin
}

const commonFields = (c: Case) => ({
  caseSubtype: c.type,
  caseSubtypeDescriptor: getCaseTypeTranslation(c.type),
  origin: c.origin,
})

const getCaseTypeTranslation = (caseType: CaseType) => {
  if (caseType === CaseType.INDICTMENT) {
    // TODO: map indictment subtypes
    return 'Ákæra'
  }
  const subtypes = courtSubtypes[caseType]
  return Array.isArray(subtypes) ? subtypes[0] : subtypes
}

const createCase = (c: Case): RequestCaseEvent => ({
  id: c.id,
  event: 'CASE_CREATED',
  eventDescriptor: 'Mál stofnað',
  date: c.created.toISOString(),
  institution: c.prosecutorsOffice?.name,
  ...commonFields(c),
})

export const eventFunctions = [createCase]
