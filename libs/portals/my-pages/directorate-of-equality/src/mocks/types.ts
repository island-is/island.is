export enum DirectorateOfEqualitySubmissionType {
  EQUALITY_PLAN = 'EQUALITY_PLAN',
  SALARY_REPORT = 'SALARY_REPORT',
}
export enum DirectorateOfEqualitySubmissionStatus {
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export enum DirectorateOfEqualityGapDirection {
  WOMEN = 'WOMEN',
  MEN = 'MEN',
  NONE = 'NONE',
}
export enum DirectorateOfEqualityGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type DirectorateOfEqualityCompany = {
  name: string
  nationalId: string
  employeeCountRange: string
  isatCategory: string
  equalityPlanRequired: boolean
  nextEqualityPlanDeadline: string | null
  salaryReportRequired: boolean
  nextSalaryReportDeadline: string | null
  serviceProviderApprovedAt: string | null
}

export type DirectorateOfEqualitySubmission = {
  id: string
  type: DirectorateOfEqualitySubmissionType
  status: DirectorateOfEqualitySubmissionStatus
  submittedAt: string
  periodFrom: number | null
  periodTo: number | null
  year: number | null
}

export type DirectorateOfEqualityEqualityPlan = {
  id: string
  identifier: string
  status: DirectorateOfEqualitySubmissionStatus
  submittedAt: string
  approvedAt: string | null
  validUntil: string | null
  periodFrom: number
  periodTo: number
  companyName: string
  companyNationalId: string
  fileName: string | null
}

export type DirectorateOfEqualityGap = {
  percent: number
  direction: DirectorateOfEqualityGapDirection
}

export type DirectorateOfEqualityAdjustedGap = DirectorateOfEqualityGap & {
  benchmarkPercent: number
  withinBenchmark: boolean
  outlierCount: number
}

export type DirectorateOfEqualityDistributionPoint = {
  score: number
  wage: number
  gender: DirectorateOfEqualityGender
  isOutlier: boolean
}

export type DirectorateOfEqualityDistribution = {
  points: DirectorateOfEqualityDistributionPoint[]
  expectedLine: { score: number; wage: number }[]
  increasePer100PointsPercent: number
  expectedWageAtMeanScore: number
}

export type DirectorateOfEqualityPayComponentsRow = {
  count: number
  additional: number
  bonus: number
  total: number
}

export type DirectorateOfEqualityPayComponents = {
  male: DirectorateOfEqualityPayComponentsRow
  female: DirectorateOfEqualityPayComponentsRow
  all: DirectorateOfEqualityPayComponentsRow
  additionalGapPercent: number
  bonusGapPercent: number
  totalGapPercent: number
}

export type DirectorateOfEqualityImprovementAction = {
  reason: string
  correctionPlan: string
  deadline: string
  responsibleName: string
  responsibleTitle: string
}

export type DirectorateOfEqualityReport = {
  id: string
  identifier: string
  status: DirectorateOfEqualitySubmissionStatus
  submittedAt: string
  approvedAt: string | null
  year: number
  analysisPeriod: string
  companyName: string
  companyNationalId: string
  adjustedGap: DirectorateOfEqualityAdjustedGap
  rawGap: DirectorateOfEqualityGap
  meanHourlyWage: { male: number; female: number }
  distribution: DirectorateOfEqualityDistribution
  payComponents: DirectorateOfEqualityPayComponents
  improvementPlan: DirectorateOfEqualityImprovementAction[]
}

export enum DirectorateOfEqualityApiKeyType {
  COMPANY = 'COMPANY',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export type DirectorateOfEqualityApiKey = {
  id: string
  keyId: string
  type: DirectorateOfEqualityApiKeyType
  label: string | null
  createdAt: string
  createdByNationalId: string | null
  expiresAt: string | null
  lastUsedAt: string | null
  revokedAt: string | null
}

export type DirectorateOfEqualityIssuedApiKey = DirectorateOfEqualityApiKey & {
  key: string
}

export type DirectorateOfEqualityServiceProvider = {
  nationalId: string
  name: string
  grantedAt: string
  grantedByNationalId: string
}

export type DirectorateOfEqualityAvailableServiceProvider = {
  nationalId: string
  name: string
}

export type DirectorateOfEqualityMutationResult = {
  success: boolean
}
