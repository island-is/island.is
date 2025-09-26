import { CaseDto } from "@island.is/clients/police-cases"
import { Case } from "../models/police-cases/case.model"

export const mapPoliceCase = (data: CaseDto): Case | null   => {
  if (!data.caseNumber) {
    return null
  }
  return {
    number: data.caseNumber,
    type: data.type,
    status: data.status,
    contact: data.contact,
    courtAdvocate: data.courtAdvocate,
    department: data.embaetti,
    received: data.receivedDate?.toISOString(),
    modified: data.modified?.toISOString(),
    receivedLocation: data.recievedLocation,
  }
}
