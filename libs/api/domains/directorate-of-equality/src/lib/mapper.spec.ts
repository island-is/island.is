import type {
  ApiKeyDto,
  ApplicationCompanyDto,
  ApplicationReportDetailDto,
  CompanyPartnerDelegationDto,
  CompanyReportDto,
  PayDispersionDto,
  ReportEmployeeOutlierDto,
  ReportStatusEnum,
  WageGapDecompositionDto,
  WageGapEmployeeDto,
} from '@island.is/clients/directorate-of-equality'

import {
  mapAdjustedGap,
  mapApiKey,
  mapAvailableServiceProviders,
  mapCompany,
  mapCompanies,
  mapDistribution,
  mapEqualityPlan,
  mapImprovementPlan,
  mapRawGap,
  mapReport,
  mapServiceProvider,
  mapSubmission,
  mapSubmissionStatus,
} from './mapper'
import {
  DirectorateOfEqualityApiKeyType,
  DirectorateOfEqualityGapDirection,
  DirectorateOfEqualityMarkedKind,
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './models/enums'

const DOWNLOAD_BASE_URL = 'https://island.is'

const company = (
  overrides: Partial<CompanyReportDto> = {},
): CompanyReportDto => ({
  id: 'company-row',
  companyId: 'company',
  reportId: 'report',
  parentCompanyId: null,
  name: 'Fyrirtæki ehf.',
  nationalId: '5501010000',
  address: 'Gata 1',
  city: 'Reykjavík',
  postcode: '101',
  employeeCountCategory: 'SMALL',
  isatCategory: '62.01',
  ...overrides,
})

const employee = (
  overrides: Partial<WageGapEmployeeDto> = {},
): WageGapEmployeeDto => ({
  ordinal: 1,
  gender: 'FEMALE',
  score: 400,
  hourlyWage: 4000,
  expectedHourlyWage: 4100,
  deviationPercent: -2.4,
  residualLog: -0.02,
  contributionLog: 0.001,
  payStatus: 'UNDERPAID',
  widensGap: true,
  inMinimumSet: false,
  ...overrides,
})

const decomposition = (
  overrides: Partial<WageGapDecompositionDto> = {},
): WageGapDecompositionDto => ({
  method: 'OAXACA_BLINDER_LOG_REGULAR_HOURLY_WAGE_BY_SCORE',
  pooledReferenceMode: 'POOLED_OLS',
  rawGapAvailable: true,
  rawGapBlockers: [],
  oskyrtAvailable: true,
  oskyrtBlockers: [],
  warnings: [],
  counts: { male: 1, female: 1, excluded: 0 },
  pooledFit: {
    slope: 0.001,
    intercept: Math.log(3000),
    sampleCount: 2,
    xMean: 500,
    yMean: 8.5,
    xSumSquares: 20000,
  },
  twofold: {},
  meanHourlyWageMale: 5000,
  meanHourlyWageFemale: 4800,
  rawGapPercent: 4,
  rawGapDirection: 'FEMALE',
  oskyrtPercent: 4.5,
  oskyrtDirection: 'FEMALE',
  employees: [
    employee({ ordinal: 1, gender: 'FEMALE', score: 400, inMinimumSet: true }),
    employee({ ordinal: 2, gender: 'MALE', score: 600 }),
  ],
  gapCarrierCount: 1,
  minimumSetSize: 1,
  oskyrtWithinBenchmark: false,
  thresholdLog: 0.0398,
  benchmarkPercent: 3.9,
  ...overrides,
})

const payDispersion = (
  overrides: Partial<PayDispersionDto> = {},
): PayDispersionDto => ({
  available: true,
  blockers: [],
  population: 'ALL_EMPLOYEES',
  threshold: 2,
  employees: [
    {
      employeeOrdinal: 2,
      gender: 'MALE',
      score: 600,
      regularHourlyWage: 6000,
      expectedHourlyWage: 5000,
      deviationPercent: 20,
      payStatus: 'OVERPAID',
      studentizedResidual: 2.3,
    },
  ],
  countBelowExpected: 0,
  countAboveExpected: 1,
  ...overrides,
})

const outlier = (
  overrides: Partial<ReportEmployeeOutlierDto> = {},
): ReportEmployeeOutlierDto => ({
  id: 'outlier',
  reportEmployeeId: 'employee',
  groupId: 'group-1',
  groupName: 'Hópur 1',
  reason: 'Ástæða',
  action: 'Úrbót',
  signatureName: 'Jón Jónsson',
  signatureRole: 'Mannauðsstjóri',
  remedyDate: new Date('2026-12-31'),
  ...overrides,
})

const reportDetail = (
  overrides: Partial<ApplicationReportDetailDto> = {},
): ApplicationReportDetailDto => ({
  id: 'internal-report-id',
  type: 'SALARY',
  status: 'APPROVED',
  companies: [company()],
  equalityReportContentType: 'HTML',
  includesImprovementPlan: true,
  externalComments: [],
  result: null,
  ...overrides,
})

describe('mapSubmissionStatus', () => {
  it.each<[ReportStatusEnum, DirectorateOfEqualitySubmissionStatus]>([
    ['DRAFT', DirectorateOfEqualitySubmissionStatus.IN_REVIEW],
    ['SUBMITTED', DirectorateOfEqualitySubmissionStatus.IN_REVIEW],
    ['POSTPONED', DirectorateOfEqualitySubmissionStatus.IN_REVIEW],
    ['IN_REVIEW', DirectorateOfEqualitySubmissionStatus.IN_REVIEW],
    ['APPROVED', DirectorateOfEqualitySubmissionStatus.APPROVED],
    ['DENIED', DirectorateOfEqualitySubmissionStatus.REJECTED],
    ['SUPERSEDED', DirectorateOfEqualitySubmissionStatus.SUPERSEDED],
    ['WITHDRAWN', DirectorateOfEqualitySubmissionStatus.WITHDRAWN],
  ])('maps %s to %s', (status, expected) => {
    expect(mapSubmissionStatus(status)).toBe(expected)
  })
})

describe('mapSubmission', () => {
  it('maps a partner-filed salary report', () => {
    const submittedAt = new Date('2026-02-19T10:30:00.000Z')

    expect(
      mapSubmission({
        providerId: 'partner:abc',
        submittedVia: 'SERVICE_PROVIDER',
        importedFromExcel: true,
        type: 'SALARY',
        status: 'SUBMITTED',
        submittedAt,
        salaryDataPeriod: '2026-01-01',
      }),
    ).toEqual({
      id: 'partner:abc',
      type: DirectorateOfEqualitySubmissionType.SALARY_REPORT,
      status: DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
      submittedVia: DirectorateOfEqualitySubmissionChannel.SERVICE_PROVIDER,
      identifier: undefined,
      submittedAt,
      approvedAt: undefined,
      validUntil: undefined,
      salaryDataPeriod: new Date('2026-01-01T00:00:00Z'),
    })
  })
})

describe('mapCompanies', () => {
  it('puts the parent company first and keeps only name and national id', () => {
    expect(
      mapCompanies([
        company({ name: 'Dóttir ehf.', parentCompanyId: 'parent' }),
        company({ name: 'Móðir hf.', parentCompanyId: null }),
      ]),
    ).toEqual([
      { name: 'Móðir hf.', nationalId: '5501010000' },
      { name: 'Dóttir ehf.', nationalId: '5501010000' },
    ])
  })
})

describe('mapAdjustedGap', () => {
  it('maps an available gap and keeps an undetermined verdict as null', () => {
    expect(
      mapAdjustedGap(decomposition({ oskyrtWithinBenchmark: null })),
    ).toEqual({
      percent: 4.5,
      direction: DirectorateOfEqualityGapDirection.FEMALE,
      benchmarkPercent: 3.9,
      withinBenchmark: undefined,
      outlierCount: 1,
    })
  })

  it('returns null when the gap is not computable', () => {
    expect(
      mapAdjustedGap(decomposition({ oskyrtAvailable: false })),
    ).toBeUndefined()
  })
})

describe('mapRawGap', () => {
  it('returns null when the raw gap is not computable', () => {
    expect(mapRawGap(decomposition({ rawGapAvailable: false }))).toBeUndefined()
  })
})

describe('mapDistribution', () => {
  it('marks the minimum set when the gap is above the benchmark', () => {
    const result = mapDistribution(decomposition(), payDispersion())

    expect(result?.markedKind).toBe(DirectorateOfEqualityMarkedKind.MINIMUM_SET)
    expect(result?.points.map((point) => point.marked)).toEqual([true, false])
  })

  it('marks pay-dispersion employees when within the benchmark', () => {
    const result = mapDistribution(
      decomposition({ oskyrtWithinBenchmark: true }),
      payDispersion(),
    )

    expect(result?.markedKind).toBe(
      DirectorateOfEqualityMarkedKind.PAY_DISPERSION,
    )
    expect(result?.points.map((point) => point.marked)).toEqual([false, true])
  })

  it('marks nothing when the verdict is undetermined', () => {
    const result = mapDistribution(
      decomposition({ oskyrtWithinBenchmark: null }),
      payDispersion(),
    )

    expect(result?.markedKind).toBeUndefined()
    expect(result?.points.some((point) => point.marked)).toBe(false)
  })

  it('has no line or derived figures without an identifiable fit', () => {
    const result = mapDistribution(
      decomposition({
        pooledFit: {
          slope: 0,
          intercept: 8,
          sampleCount: 2,
          xMean: 500,
          xSumSquares: 0,
        },
      }),
      payDispersion(),
    )

    expect(result?.expectedLine).toEqual([])
    expect(result?.increasePer100PointsPercent).toBeUndefined()
    expect(result?.expectedWageAtMeanScore).toBeUndefined()
  })

  it('derives the expected line and figures from the fit', () => {
    const result = mapDistribution(decomposition(), payDispersion())

    expect(result?.expectedLine).toHaveLength(49)
    expect(result?.expectedLine[0].score).toBe(400)
    expect(result?.expectedLine[48].score).toBe(600)
    expect(result?.increasePer100PointsPercent).toBeCloseTo(10.517, 2)
    expect(result?.expectedWageAtMeanScore).toBeCloseTo(4946.16, 1)
  })

  it('returns null without employees', () => {
    expect(
      mapDistribution(decomposition({ employees: [] }), payDispersion()),
    ).toBeUndefined()
  })
})

describe('mapImprovementPlan', () => {
  it('returns one action per outlier group, in first-seen order', () => {
    const deadline = new Date('2027-01-31')

    expect(
      mapImprovementPlan([
        outlier({ id: 'a', groupId: 'group-1' }),
        outlier({
          id: 'b',
          groupId: 'group-2',
          groupName: null,
          action: 'Hækka laun',
          remedyDate: deadline,
        }),
        outlier({ id: 'c', groupId: 'group-1' }),
      ]),
    ).toEqual([
      {
        id: 'group-1',
        name: 'Hópur 1',
        reason: 'Ástæða',
        correctionPlan: 'Úrbót',
        deadline: new Date('2026-12-31'),
        responsibleName: 'Jón Jónsson',
        responsibleTitle: 'Mannauðsstjóri',
      },
      {
        id: 'group-2',
        name: undefined,
        reason: 'Ástæða',
        correctionPlan: 'Hækka laun',
        deadline,
        responsibleName: 'Jón Jónsson',
        responsibleTitle: 'Mannauðsstjóri',
      },
    ])
  })
})

describe('mapReport', () => {
  it('leaves every analysis section null when the report has no result', () => {
    const report = mapReport('provider-id', reportDetail(), DOWNLOAD_BASE_URL)

    expect(report).toMatchObject({
      id: 'provider-id',
      status: DirectorateOfEqualitySubmissionStatus.APPROVED,
      adjustedGap: undefined,
      rawGap: undefined,
      meanHourlyWage: undefined,
      distribution: undefined,
      includesImprovementPlan: true,
    })
  })
})

describe('PDF download URLs', () => {
  it.each<[ReportStatusEnum, boolean]>([
    ['APPROVED', true],
    ['SUPERSEDED', true],
    ['SUBMITTED', false],
    ['IN_REVIEW', false],
    ['DENIED', false],
    ['WITHDRAWN', false],
  ])('status %s has a PDF: %s', (status, expected) => {
    const plan = mapEqualityPlan(
      'partner:1',
      reportDetail({ type: 'EQUALITY', status }),
      DOWNLOAD_BASE_URL,
    )
    const report = mapReport(
      'partner:1',
      reportDetail({ status }),
      DOWNLOAD_BASE_URL,
    )
    const pdfUrl = `${DOWNLOAD_BASE_URL}/download/v1/directorate-of-equality/reports/partner%3A1/pdf`

    expect(plan.pdfUrl).toBe(expected ? pdfUrl : undefined)
    expect(report.pdfUrl).toBe(expected ? pdfUrl : undefined)
    expect(report.improvementPlanPdfUrl).toBe(
      expected
        ? `${DOWNLOAD_BASE_URL}/download/v1/directorate-of-equality/reports/partner%3A1/improvement-plan-pdf`
        : undefined,
    )
  })

  it('has no improvement-plan URL without an improvement plan', () => {
    expect(
      mapReport(
        'provider-id',
        reportDetail({ includesImprovementPlan: false }),
        DOWNLOAD_BASE_URL,
      ).improvementPlanPdfUrl,
    ).toBeUndefined()
  })
})

const delegation = (
  overrides: Partial<CompanyPartnerDelegationDto> = {},
): CompanyPartnerDelegationDto => ({
  id: 'delegation-1',
  provider: {
    id: 'provider-1',
    name: 'Launaþjónustan ehf.',
    nationalId: '5501010001',
  },
  scopes: ['salary:submit'],
  grantedAt: new Date('2026-10-01'),
  grantedByNationalId: '0000000000',
  grantedByName: 'Jón Jónsson',
  ...overrides,
})

const companyDto = (
  overrides: Partial<ApplicationCompanyDto> = {},
): ApplicationCompanyDto => ({
  id: 'company',
  name: 'Fyrirtæki ehf.',
  employeeCountCategory: 'UNKNOWN',
  nationalId: '5501010000',
  status: 'ACTIVE',
  salaryReportRequired: false,
  salaryReportRequiredOverride: false,
  finesStarted: false,
  quarantined: false,
  sector: 'UNKNOWN',
  sectorOverride: false,
  reportStatus: 'MISSING_EQUALITY_REPORT',
  equalityObligationStatus: 'MISSING',
  salaryObligationStatus: 'MISSING',
  equalityReportOverdue: false,
  salaryReportOverdue: false,
  hasLegacyReports: false,
  isServiceProvider: false,
  ...overrides,
})

describe('mapCompany', () => {
  it('derives the obligations from the obligation statuses', () => {
    const approvedAt = new Date('2026-01-15')
    const company = companyDto({
      equalityObligationStatus: 'MISSING',
      salaryObligationStatus: 'NOT_REQUIRED',
      nextEqualityReportDueAt: new Date('2027-01-01'),
      nextSalaryReportDueAt: null,
    })

    expect(mapCompany(company, approvedAt)).toEqual({
      equalityPlanRequired: true,
      nextEqualityPlanDeadline: new Date('2027-01-01'),
      salaryReportRequired: false,
      nextSalaryReportDeadline: undefined,
      serviceProviderApprovedAt: approvedAt,
    })
  })
})

describe('mapApiKey', () => {
  it('flags keys created by Jafnréttisstofa and never exposes a kennitala', () => {
    const apiKey: ApiKeyDto = {
      id: 'key-1',
      companyId: 'company',
      keyId: 'abc',
      scopes: ['report:read'],
      createdVia: 'ADMIN',
      createdByNationalId: '0000000000',
      createdAt: new Date('2026-11-01'),
    }

    const mapped = mapApiKey(apiKey, DirectorateOfEqualityApiKeyType.COMPANY)

    expect(mapped).toEqual({
      id: 'key-1',
      keyId: 'abc',
      type: DirectorateOfEqualityApiKeyType.COMPANY,
      label: undefined,
      createdAt: new Date('2026-11-01'),
      createdByName: undefined,
      createdByDirectorate: true,
      expiresAt: undefined,
      lastUsedAt: undefined,
      revokedAt: undefined,
    })
    expect(JSON.stringify(mapped)).not.toContain('0000000000')
  })
})

describe('mapServiceProvider', () => {
  it('maps a delegation to the provider with the granter name only', () => {
    expect(mapServiceProvider(delegation())).toEqual({
      id: 'delegation-1',
      name: 'Launaþjónustan ehf.',
      nationalId: '5501010001',
      grantedAt: new Date('2026-10-01'),
      grantedByName: 'Jón Jónsson',
    })
  })
})

describe('mapAvailableServiceProviders', () => {
  it('leaves out providers that already have permission', () => {
    expect(
      mapAvailableServiceProviders(
        [
          {
            id: 'provider-1',
            name: 'Launaþjónustan ehf.',
            nationalId: '5501010001',
          },
          { id: 'provider-2', name: 'Bókhald hf.', nationalId: '5501010002' },
        ],
        [delegation()],
      ),
    ).toEqual([
      { id: 'provider-2', name: 'Bókhald hf.', nationalId: '5501010002' },
    ])
  })
})
