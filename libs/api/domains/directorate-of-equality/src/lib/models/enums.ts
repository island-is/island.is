import { registerEnumType } from '@nestjs/graphql'

export enum DirectorateOfEqualitySubmissionType {
  EQUALITY_PLAN = 'EQUALITY_PLAN',
  SALARY_REPORT = 'SALARY_REPORT',
}

export enum DirectorateOfEqualitySubmissionStatus {
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUPERSEDED = 'SUPERSEDED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum DirectorateOfEqualitySubmissionChannel {
  ISLAND_IS = 'ISLAND_IS',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  DIRECTORATE = 'DIRECTORATE',
}

registerEnumType(DirectorateOfEqualitySubmissionType, {
  name: 'DirectorateOfEqualitySubmissionType',
})
registerEnumType(DirectorateOfEqualitySubmissionStatus, {
  name: 'DirectorateOfEqualitySubmissionStatus',
})
registerEnumType(DirectorateOfEqualitySubmissionChannel, {
  name: 'DirectorateOfEqualitySubmissionChannel',
})
