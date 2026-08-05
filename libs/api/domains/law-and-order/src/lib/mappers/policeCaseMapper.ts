import { PoliceCaseDto } from '@island.is/clients/police-cases'
import { Case } from '../models/police-cases/case.model'
import type { Locale } from '@island.is/shared/types'
import {
  mapPoliceCaseStatus,
  mapPoliceCaseStatusValue,
} from './policeCaseStatusMapper'
import { FormatMessage } from '@island.is/cms-translations'

export const mapPoliceCase = (
  data: PoliceCaseDto,
  locale: Locale,
  formatMessage: FormatMessage,
): Case | null => {
  if (!data.caseNumber) {
    return null
  }

  return {
    cacheId: `${data.caseNumber}${locale}`,
    number: data.caseNumber,
    type: data.type,
    status: mapPoliceCaseStatus(
      mapPoliceCaseStatusValue(data.status),
      formatMessage,
      data.status,
    ),
    contact: data.contact,
    courtAdvocate: data.courtAdvocate,
    department: data.department,
    prosecutionOffice: data.prosecutionOffice,
    received: data.receivedDate?.toISOString(),
    modified: data.modifiedDate?.toISOString(),
    receivedLocation: data.recievedLocation,
  }
}
