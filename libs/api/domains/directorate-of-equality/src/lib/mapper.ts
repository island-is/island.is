import {
  ApiKeyDto,
  ApiKeyOriginEnum,
  ApplicationCompanyDto,
  ApplicationReportChannelEnum,
  ApplicationReportDetailDto,
  CompanyObligationStatusEnum,
  CompanyPartnerDelegationDto,
  ApplicationReportListItemDto,
  CompanyReportDto,
  PartnerClientKeyDto,
  PartnerProviderDto,
  PayDispersionDto,
  ReportEmployeeOutlierDto,
  ReportStatusEnum,
  ReportTypeEnum,
  SalaryDataBasisEnum,
  WageGapDecompositionDto,
  WageGapPooledFitDto,
} from '@island.is/clients/directorate-of-equality'

import { AdjustedGap } from './models/adjustedGap.model'
import { ApiKey } from './models/apiKey.model'
import { AvailableServiceProvider } from './models/availableServiceProvider.model'
import { Company } from './models/company.model'
import { Distribution } from './models/distribution.model'
import {
  DirectorateOfEqualityApiKeyType,
  DirectorateOfEqualityGapDirection,
  DirectorateOfEqualityGender,
  DirectorateOfEqualityMarkedKind,
  DirectorateOfEqualitySalaryDataBasis,
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './models/enums'
import { EqualityPlan } from './models/equalityPlan.model'
import { Gap } from './models/gap.model'
import { ImprovementAction } from './models/improvementAction.model'
import { MeanHourlyWage } from './models/meanHourlyWage.model'
import { ReportWithContext } from './models/report.model'
import { ReportCompany } from './models/reportCompany.model'
import { ServiceProvider } from './models/serviceProvider.model'
import { Submission } from './models/submission.model'

const CURVE_SAMPLES = 48

type Direction = 'FEMALE' | 'MALE' | 'NONE'
type IdentifiableFit = WageGapPooledFitDto & {
  slope: number
  intercept: number
}

export const mapSubmissionType = (
  type: ReportTypeEnum,
): DirectorateOfEqualitySubmissionType | undefined => {
  switch (type) {
    case ReportTypeEnum.EQUALITY:
      return DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
    case ReportTypeEnum.SALARY:
      return DirectorateOfEqualitySubmissionType.SALARY_REPORT
    default:
      return undefined
  }
}

export const mapSubmissionStatus = (
  status: ReportStatusEnum,
): DirectorateOfEqualitySubmissionStatus => {
  switch (status) {
    case ReportStatusEnum.DRAFT:
    case ReportStatusEnum.SUBMITTED:
    case ReportStatusEnum.POSTPONED:
    case ReportStatusEnum.IN_REVIEW:
      return DirectorateOfEqualitySubmissionStatus.IN_REVIEW
    case ReportStatusEnum.APPROVED:
      return DirectorateOfEqualitySubmissionStatus.APPROVED
    case ReportStatusEnum.DENIED:
      return DirectorateOfEqualitySubmissionStatus.REJECTED
    case ReportStatusEnum.SUPERSEDED:
      return DirectorateOfEqualitySubmissionStatus.SUPERSEDED
    case ReportStatusEnum.WITHDRAWN:
      return DirectorateOfEqualitySubmissionStatus.WITHDRAWN
    default:
      return DirectorateOfEqualitySubmissionStatus.UNKNOWN
  }
}

const mapSalaryDataPeriod = (period?: string | null): Date | undefined =>
  period ? new Date(`${period.slice(0, 10)}T00:00:00Z`) : undefined

const hasPdf = (status: ReportStatusEnum) =>
  status === ReportStatusEnum.APPROVED || status === ReportStatusEnum.SUPERSEDED

const reportDownloadUrl = (
  downloadBaseUrl: string,
  providerId: string,
  file: 'pdf' | 'improvement-plan-pdf',
) =>
  `${downloadBaseUrl}/download/v1/directorate-of-equality/reports/${encodeURIComponent(
    providerId,
  )}/${file}`

const mapSubmissionChannel = (
  channel: ApplicationReportChannelEnum,
): DirectorateOfEqualitySubmissionChannel => {
  switch (channel) {
    case ApplicationReportChannelEnum.ISLAND_IS:
      return DirectorateOfEqualitySubmissionChannel.ISLAND_IS
    case ApplicationReportChannelEnum.SERVICE_PROVIDER:
      return DirectorateOfEqualitySubmissionChannel.SERVICE_PROVIDER
    case ApplicationReportChannelEnum.DIRECTORATE:
      return DirectorateOfEqualitySubmissionChannel.DIRECTORATE
    default:
      return DirectorateOfEqualitySubmissionChannel.UNKNOWN
  }
}

export const mapSubmission = (
  report: ApplicationReportListItemDto,
): Submission | undefined => {
  const type = mapSubmissionType(report.type)
  return type ? mapKnownSubmission(report, type) : undefined
}

const mapKnownSubmission = (
  report: ApplicationReportListItemDto,
  type: DirectorateOfEqualitySubmissionType,
): Submission => ({
  id: report.providerId,
  type,
  status: mapSubmissionStatus(report.status),
  submittedVia: mapSubmissionChannel(report.submittedVia),
  identifier: report.identifier ?? undefined,
  submittedAt: report.submittedAt ?? undefined,
  approvedAt: report.approvedAt ?? undefined,
  validUntil: report.validUntil ?? undefined,
  salaryDataPeriod: mapSalaryDataPeriod(report.salaryDataPeriod),
})

const mapDirection = (
  direction?: Direction | null,
): DirectorateOfEqualityGapDirection =>
  direction === 'FEMALE'
    ? DirectorateOfEqualityGapDirection.FEMALE
    : direction === 'MALE'
    ? DirectorateOfEqualityGapDirection.MALE
    : DirectorateOfEqualityGapDirection.NONE

const mapGender = (
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL',
): DirectorateOfEqualityGender => {
  switch (gender) {
    case 'MALE':
      return DirectorateOfEqualityGender.MALE
    case 'FEMALE':
      return DirectorateOfEqualityGender.FEMALE
    case 'NEUTRAL':
      return DirectorateOfEqualityGender.NEUTRAL
    default:
      return DirectorateOfEqualityGender.UNKNOWN
  }
}

const mapSalaryDataBasis = (
  basis?: SalaryDataBasisEnum | null,
): DirectorateOfEqualitySalaryDataBasis | undefined =>
  basis === SalaryDataBasisEnum.MONTH
    ? DirectorateOfEqualitySalaryDataBasis.MONTH
    : basis === SalaryDataBasisEnum.AVERAGE
    ? DirectorateOfEqualitySalaryDataBasis.AVERAGE
    : undefined

export const mapCompanies = (companies: CompanyReportDto[]): ReportCompany[] =>
  [...companies]
    .sort(
      (a, b) =>
        Number(a.parentCompanyId != null) - Number(b.parentCompanyId != null),
    )
    .map(({ name, nationalId }) => ({ name, nationalId }))

const isIdentifiableFit = (
  fit?: WageGapPooledFitDto | null,
): fit is IdentifiableFit =>
  Boolean(
    fit && fit.xSumSquares > 0 && fit.slope != null && fit.intercept != null,
  )

export const mapAdjustedGap = (
  d: WageGapDecompositionDto,
): AdjustedGap | undefined =>
  d.oskyrtAvailable && d.oskyrtPercent != null
    ? {
        percent: d.oskyrtPercent,
        direction: mapDirection(d.oskyrtDirection),
        benchmarkPercent: d.benchmarkPercent,
        withinBenchmark: d.oskyrtWithinBenchmark ?? undefined,
        outlierCount: d.minimumSetSize,
      }
    : undefined

export const mapRawGap = (d: WageGapDecompositionDto): Gap | undefined =>
  d.rawGapAvailable && d.rawGapPercent != null
    ? { percent: d.rawGapPercent, direction: mapDirection(d.rawGapDirection) }
    : undefined

export const mapMeanHourlyWage = (
  d: WageGapDecompositionDto,
): MeanHourlyWage => ({
  male: d.meanHourlyWageMale ?? undefined,
  female: d.meanHourlyWageFemale ?? undefined,
})

export const mapDistribution = (
  d: WageGapDecompositionDto,
  payDispersion: PayDispersionDto,
): Distribution | undefined => {
  if (d.employees.length === 0) return undefined

  const markedKind =
    d.oskyrtWithinBenchmark === false
      ? DirectorateOfEqualityMarkedKind.MINIMUM_SET
      : d.oskyrtWithinBenchmark === true &&
        payDispersion.available &&
        payDispersion.population === 'ALL_EMPLOYEES'
      ? DirectorateOfEqualityMarkedKind.PAY_DISPERSION
      : undefined
  const dispersionOrdinals = new Set(
    payDispersion.employees.map((employee) => employee.employeeOrdinal),
  )

  const points = d.employees.map((employee) => ({
    score: employee.score,
    wage: employee.hourlyWage,
    gender: mapGender(employee.gender),
    marked:
      markedKind === DirectorateOfEqualityMarkedKind.MINIMUM_SET
        ? employee.inMinimumSet
        : markedKind === DirectorateOfEqualityMarkedKind.PAY_DISPERSION
        ? dispersionOrdinals.has(employee.ordinal)
        : false,
  }))

  const fit = d.pooledFit
  const hasFit = isIdentifiableFit(fit)
  const predict = (score: number) =>
    hasFit ? Math.exp(fit.intercept + fit.slope * score) : 0
  const scores = points.map((point) => point.score)
  const from = Math.min(...scores)
  const to = Math.max(...scores)

  return {
    points,
    markedKind: points.some((point) => point.marked) ? markedKind : undefined,
    expectedLine: hasFit
      ? Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => {
          const score = from + ((to - from) * i) / CURVE_SAMPLES
          return { score, wage: predict(score) }
        })
      : [],
    increasePer100PointsPercent: hasFit
      ? (Math.exp(fit.slope * 100) - 1) * 100
      : undefined,
    expectedWageAtMeanScore:
      hasFit && fit.xMean != null ? predict(fit.xMean) : undefined,
  }
}

export const mapEqualityPlan = (
  providerId: string,
  report: ApplicationReportDetailDto,
  downloadBaseUrl: string,
): EqualityPlan => ({
  id: providerId,
  status: mapSubmissionStatus(report.status),
  identifier: report.identifier ?? undefined,
  submittedAt: report.submittedAt ?? undefined,
  approvedAt: report.approvedAt ?? undefined,
  validUntil: report.validUntil ?? undefined,
  companies: mapCompanies(report.companies),
  documentFileName: report.equalityReportContentFilename ?? undefined,
  pdfUrl: hasPdf(report.status)
    ? reportDownloadUrl(downloadBaseUrl, providerId, 'pdf')
    : undefined,
})

export const mapReport = (
  providerId: string,
  report: ApplicationReportDetailDto,
  downloadBaseUrl: string,
): ReportWithContext => {
  const decomposition = report.result?.wageGapDecomposition
  const withPdf = hasPdf(report.status)
  return {
    id: providerId,
    status: mapSubmissionStatus(report.status),
    identifier: report.identifier ?? undefined,
    submittedAt: report.submittedAt ?? undefined,
    approvedAt: report.approvedAt ?? undefined,
    companies: mapCompanies(report.companies),
    salaryDataBasis: mapSalaryDataBasis(report.salaryDataBasis),
    salaryDataPeriod: mapSalaryDataPeriod(report.salaryDataPeriod),
    adjustedGap: decomposition ? mapAdjustedGap(decomposition) : undefined,
    rawGap: decomposition ? mapRawGap(decomposition) : undefined,
    meanHourlyWage: decomposition
      ? mapMeanHourlyWage(decomposition)
      : undefined,
    distribution:
      decomposition && report.result
        ? mapDistribution(decomposition, report.result.payDispersion)
        : undefined,
    pdfUrl: withPdf
      ? reportDownloadUrl(downloadBaseUrl, providerId, 'pdf')
      : undefined,
    improvementPlanPdfUrl:
      withPdf && report.includesImprovementPlan
        ? reportDownloadUrl(downloadBaseUrl, providerId, 'improvement-plan-pdf')
        : undefined,
    includesImprovementPlan: report.includesImprovementPlan,
  }
}

export const mapImprovementPlan = (
  outliers: ReportEmployeeOutlierDto[],
): ImprovementAction[] => {
  const byGroup = new Map<string, ImprovementAction>()
  for (const outlier of outliers) {
    if (!byGroup.has(outlier.groupId)) {
      byGroup.set(outlier.groupId, {
        id: outlier.groupId,
        name: outlier.groupName ?? undefined,
        reason: outlier.reason ?? undefined,
        correctionPlan: outlier.action ?? undefined,
        deadline: outlier.remedyDate ?? undefined,
        responsibleName: outlier.signatureName ?? undefined,
        responsibleTitle: outlier.signatureRole ?? undefined,
      })
    }
  }
  return [...byGroup.values()]
}

export const mapCompany = (
  company: ApplicationCompanyDto,
  serviceProviderApprovedAt?: Date,
): Company => ({
  equalityPlanRequired:
    company.equalityObligationStatus !==
    CompanyObligationStatusEnum.NOT_REQUIRED,
  nextEqualityPlanDeadline: company.nextEqualityReportDueAt ?? undefined,
  salaryReportRequired:
    company.salaryObligationStatus !== CompanyObligationStatusEnum.NOT_REQUIRED,
  nextSalaryReportDeadline: company.nextSalaryReportDueAt ?? undefined,
  serviceProviderApprovedAt,
})

export const mapApiKey = (
  apiKey: ApiKeyDto | PartnerClientKeyDto,
  type: DirectorateOfEqualityApiKeyType,
): ApiKey => ({
  id: apiKey.id,
  keyId: apiKey.keyId,
  type,
  label: apiKey.label ?? undefined,
  createdAt: apiKey.createdAt,
  createdByName: apiKey.createdByName ?? undefined,
  createdByDirectorate: apiKey.createdVia === ApiKeyOriginEnum.ADMIN,
  expiresAt: apiKey.expiresAt ?? undefined,
  lastUsedAt: apiKey.lastUsedAt ?? undefined,
  revokedAt: apiKey.revokedAt ?? undefined,
})

export const mapServiceProvider = (
  delegation: CompanyPartnerDelegationDto,
): ServiceProvider => ({
  id: delegation.id,
  name: delegation.provider.name,
  nationalId: delegation.provider.nationalId,
  grantedAt: delegation.grantedAt,
  grantedByName: delegation.grantedByName ?? undefined,
})

export const mapAvailableServiceProviders = (
  providers: PartnerProviderDto[],
  delegations: CompanyPartnerDelegationDto[],
): AvailableServiceProvider[] => {
  const granted = new Set(delegations.map(({ provider }) => provider.id))
  return providers
    .filter((provider) => !granted.has(provider.id))
    .map(({ id, name, nationalId }) => ({ id, name, nationalId }))
}
