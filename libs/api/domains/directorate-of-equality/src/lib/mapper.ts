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

import { ApiKey } from './models/apiKey.model'
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
import { AdjustedGap, Gap } from './models/gap.model'
import { ImprovementAction } from './models/improvementAction.model'
import { MeanHourlyWage } from './models/meanHourlyWage.model'
import { ReportWithContext } from './models/report.model'
import { ReportCompany } from './models/reportCompany.model'
import {
  AvailableServiceProvider,
  ServiceProvider,
} from './models/serviceProvider.model'
import { Submission } from './models/submission.model'

const CURVE_SAMPLES = 48

type Direction = 'FEMALE' | 'MALE' | 'NONE'
type IdentifiableFit = WageGapPooledFitDto & {
  slope: number
  intercept: number
}

export const mapSubmissionType = (
  type: ReportTypeEnum,
): DirectorateOfEqualitySubmissionType =>
  type === ReportTypeEnum.EQUALITY
    ? DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
    : DirectorateOfEqualitySubmissionType.SALARY_REPORT

export const mapSubmissionStatus = (
  status: ReportStatusEnum,
): DirectorateOfEqualitySubmissionStatus => {
  switch (status) {
    case ReportStatusEnum.APPROVED:
      return DirectorateOfEqualitySubmissionStatus.APPROVED
    case ReportStatusEnum.DENIED:
      return DirectorateOfEqualitySubmissionStatus.REJECTED
    case ReportStatusEnum.SUPERSEDED:
      return DirectorateOfEqualitySubmissionStatus.SUPERSEDED
    case ReportStatusEnum.WITHDRAWN:
      return DirectorateOfEqualitySubmissionStatus.WITHDRAWN
    default:
      return DirectorateOfEqualitySubmissionStatus.IN_REVIEW
  }
}

const mapSalaryDataPeriod = (period?: string | null): Date | null =>
  period ? new Date(`${period.slice(0, 10)}T00:00:00Z`) : null

const hasPdf = (status: ReportStatusEnum) =>
  status === ReportStatusEnum.APPROVED || status === ReportStatusEnum.SUPERSEDED

const mapSubmissionChannel = (
  channel: ApplicationReportChannelEnum,
): DirectorateOfEqualitySubmissionChannel => {
  switch (channel) {
    case ApplicationReportChannelEnum.SERVICE_PROVIDER:
      return DirectorateOfEqualitySubmissionChannel.SERVICE_PROVIDER
    case ApplicationReportChannelEnum.DIRECTORATE:
      return DirectorateOfEqualitySubmissionChannel.DIRECTORATE
    default:
      return DirectorateOfEqualitySubmissionChannel.ISLAND_IS
  }
}

export const mapSubmission = (
  report: ApplicationReportListItemDto,
): Submission => ({
  id: report.providerId,
  type: mapSubmissionType(report.type),
  status: mapSubmissionStatus(report.status),
  submittedVia: mapSubmissionChannel(report.submittedVia),
  identifier: report.identifier ?? null,
  submittedAt: report.submittedAt ?? null,
  approvedAt: report.approvedAt ?? null,
  validUntil: report.validUntil ?? null,
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
): DirectorateOfEqualityGender =>
  gender === 'MALE'
    ? DirectorateOfEqualityGender.MALE
    : gender === 'FEMALE'
    ? DirectorateOfEqualityGender.FEMALE
    : DirectorateOfEqualityGender.NEUTRAL

const mapSalaryDataBasis = (
  basis?: SalaryDataBasisEnum | null,
): DirectorateOfEqualitySalaryDataBasis | null =>
  basis === SalaryDataBasisEnum.MONTH
    ? DirectorateOfEqualitySalaryDataBasis.MONTH
    : basis === SalaryDataBasisEnum.AVERAGE
    ? DirectorateOfEqualitySalaryDataBasis.AVERAGE
    : null

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
): AdjustedGap | null =>
  d.oskyrtAvailable && d.oskyrtPercent != null
    ? {
        percent: d.oskyrtPercent,
        direction: mapDirection(d.oskyrtDirection),
        benchmarkPercent: d.benchmarkPercent,
        withinBenchmark: d.oskyrtWithinBenchmark ?? null,
        outlierCount: d.minimumSetSize,
      }
    : null

export const mapRawGap = (d: WageGapDecompositionDto): Gap | null =>
  d.rawGapAvailable && d.rawGapPercent != null
    ? { percent: d.rawGapPercent, direction: mapDirection(d.rawGapDirection) }
    : null

export const mapMeanHourlyWage = (
  d: WageGapDecompositionDto,
): MeanHourlyWage => ({
  male: d.meanHourlyWageMale ?? null,
  female: d.meanHourlyWageFemale ?? null,
})

export const mapDistribution = (
  d: WageGapDecompositionDto,
  payDispersion: PayDispersionDto,
): Distribution | null => {
  if (d.employees.length === 0) return null

  const markedKind =
    d.oskyrtWithinBenchmark === false
      ? DirectorateOfEqualityMarkedKind.MINIMUM_SET
      : d.oskyrtWithinBenchmark === true &&
        payDispersion.available &&
        payDispersion.population === 'ALL_EMPLOYEES'
      ? DirectorateOfEqualityMarkedKind.PAY_DISPERSION
      : null
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
    markedKind: points.some((point) => point.marked) ? markedKind : null,
    expectedLine: hasFit
      ? Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => {
          const score = from + ((to - from) * i) / CURVE_SAMPLES
          return { score, wage: predict(score) }
        })
      : [],
    increasePer100PointsPercent: hasFit
      ? (Math.exp(fit.slope * 100) - 1) * 100
      : null,
    expectedWageAtMeanScore:
      hasFit && fit.xMean != null ? predict(fit.xMean) : null,
  }
}

export const mapEqualityPlan = (
  providerId: string,
  report: ApplicationReportDetailDto,
): EqualityPlan => ({
  id: providerId,
  status: mapSubmissionStatus(report.status),
  identifier: report.identifier ?? null,
  submittedAt: report.submittedAt ?? null,
  approvedAt: report.approvedAt ?? null,
  validUntil: report.validUntil ?? null,
  companies: mapCompanies(report.companies),
  documentFileName: report.equalityReportContentFilename ?? null,
  hasPdf: hasPdf(report.status),
})

export const mapReport = (
  providerId: string,
  report: ApplicationReportDetailDto,
): ReportWithContext => {
  const decomposition = report.result?.wageGapDecomposition
  return {
    id: providerId,
    status: mapSubmissionStatus(report.status),
    identifier: report.identifier ?? null,
    submittedAt: report.submittedAt ?? null,
    approvedAt: report.approvedAt ?? null,
    companies: mapCompanies(report.companies),
    salaryDataBasis: mapSalaryDataBasis(report.salaryDataBasis),
    salaryDataPeriod: mapSalaryDataPeriod(report.salaryDataPeriod),
    adjustedGap: decomposition ? mapAdjustedGap(decomposition) : null,
    rawGap: decomposition ? mapRawGap(decomposition) : null,
    meanHourlyWage: decomposition ? mapMeanHourlyWage(decomposition) : null,
    distribution:
      decomposition && report.result
        ? mapDistribution(decomposition, report.result.payDispersion)
        : null,
    hasPdf: hasPdf(report.status),
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
        name: outlier.groupName ?? null,
        reason: outlier.reason ?? null,
        correctionPlan: outlier.action ?? null,
        deadline: outlier.remedyDate ?? null,
        responsibleName: outlier.signatureName ?? null,
        responsibleTitle: outlier.signatureRole ?? null,
      })
    }
  }
  return [...byGroup.values()]
}

export const mapCompany = (
  company: ApplicationCompanyDto,
  serviceProviderApprovedAt: Date | null,
): Company => ({
  equalityPlanRequired:
    company.equalityObligationStatus !==
    CompanyObligationStatusEnum.NOT_REQUIRED,
  nextEqualityPlanDeadline: company.nextEqualityReportDueAt ?? null,
  salaryReportRequired:
    company.salaryObligationStatus !== CompanyObligationStatusEnum.NOT_REQUIRED,
  nextSalaryReportDeadline: company.nextSalaryReportDueAt ?? null,
  serviceProviderApprovedAt,
})

export const mapApiKey = (
  apiKey: ApiKeyDto | PartnerClientKeyDto,
  type: DirectorateOfEqualityApiKeyType,
): ApiKey => ({
  id: apiKey.id,
  keyId: apiKey.keyId,
  type,
  label: apiKey.label ?? null,
  createdAt: apiKey.createdAt,
  createdByName: apiKey.createdByName ?? null,
  createdByDirectorate: apiKey.createdVia === ApiKeyOriginEnum.ADMIN,
  expiresAt: apiKey.expiresAt ?? null,
  lastUsedAt: apiKey.lastUsedAt ?? null,
  revokedAt: apiKey.revokedAt ?? null,
})

export const mapServiceProvider = (
  delegation: CompanyPartnerDelegationDto,
): ServiceProvider => ({
  id: delegation.id,
  name: delegation.provider.name,
  nationalId: delegation.provider.nationalId,
  grantedAt: delegation.grantedAt,
  grantedByName: delegation.grantedByName ?? null,
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
