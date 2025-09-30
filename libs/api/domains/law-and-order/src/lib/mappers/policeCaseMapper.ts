import { PoliceCaseDto } from '@island.is/clients/police-cases'
import { Case } from '../models/police-cases/case.model'
import { mapPoliceCaseStatus } from './policeCaseStatusMapper'

export const mapPoliceCase = (data: PoliceCaseDto): Case | null => {
  if (!data.caseNumber) {
    return null
  }
  return {
    number: data.caseNumber,
    type: data.type,
    status: mapPoliceCaseStatus(data.status),
    contact: data.contact,
    courtAdvocate: data.courtAdvocate,
    department: data.department,
    received: data.receivedDate?.toISOString(),
    modified: data.modifiedDate?.toISOString(),
    receivedLocation: data.recievedLocation,
  }
}
