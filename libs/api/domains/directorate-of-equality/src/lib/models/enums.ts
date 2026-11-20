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

export enum DirectorateOfEqualityGapDirection {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  NONE = 'NONE',
}

export enum DirectorateOfEqualityGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NEUTRAL = 'NEUTRAL',
}

export enum DirectorateOfEqualityMarkedKind {
  MINIMUM_SET = 'MINIMUM_SET',
  PAY_DISPERSION = 'PAY_DISPERSION',
}

export enum DirectorateOfEqualitySalaryDataBasis {
  MONTH = 'MONTH',
  AVERAGE = 'AVERAGE',
}

registerEnumType(DirectorateOfEqualityGapDirection, {
  name: 'DirectorateOfEqualityGapDirection',
  description: 'Which gender the gap is unfavourable to',
})
registerEnumType(DirectorateOfEqualityGender, {
  name: 'DirectorateOfEqualityGender',
})
registerEnumType(DirectorateOfEqualityMarkedKind, {
  name: 'DirectorateOfEqualityMarkedKind',
  description:
    'Why points are marked: MINIMUM_SET when the adjusted gap is above the benchmark (fewest employees to correct), PAY_DISPERSION when within it (pay far from the expected wage)',
})
registerEnumType(DirectorateOfEqualitySalaryDataBasis, {
  name: 'DirectorateOfEqualitySalaryDataBasis',
  description:
    'MONTH: one payroll month (see salaryDataPeriod); AVERAGE: a twelve-month average',
})

export enum DirectorateOfEqualityApiKeyType {
  COMPANY = 'COMPANY',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

registerEnumType(DirectorateOfEqualityApiKeyType, {
  name: 'DirectorateOfEqualityApiKeyType',
  description:
    "COMPANY: the company's own key; SERVICE_PROVIDER: a key the company holds as an approved service provider",
})
