import { CaseDto } from '../../../gen/fetch'

export interface PoliceCaseDto {
  personId?: number
  caseNumber?: string
  type?: string
  status?: string
  contact?: string
  courtAdvocate?: string
  department?: string
  receivedDate?: Date
  recievedLocation?: string
  modifiedDate?: Date
}

export const mapCaseDto = (caseDto: CaseDto): PoliceCaseDto => {
  return {
    ...caseDto,
    personId: caseDto.personId,
    department: caseDto.embaetti,
    modifiedDate: caseDto.modified,
  }
}
