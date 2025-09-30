import { PoliceCaseDto } from '@island.is/clients/police-cases'
import { Case } from '../models/police-cases/case.model'
import {
  mapPoliceCaseStatus,
  mapPoliceCaseStatusValue,
} from './policeCaseStatusMapper'
import { FormatMessage } from '@island.is/cms-translations'

export const mapPoliceCase = (
  data: PoliceCaseDto,
  formatMessage: FormatMessage,
): Case | null => {
  if (!data.caseNumber) {
    return null
  }

  return {
    number: data.caseNumber,
    type: data.type,
    status: mapPoliceCaseStatus(
      mapPoliceCaseStatusValue(data.status),
      formatMessage,
    ),
    contact: data.contact,
    courtAdvocate: data.courtAdvocate,
    department: data.department,
    received: data.receivedDate?.toISOString(),
    modified: data.modifiedDate?.toISOString(),
    receivedLocation: data.recievedLocation,
  }
}
