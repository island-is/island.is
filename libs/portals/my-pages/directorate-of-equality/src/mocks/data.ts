import {
  DirectorateOfEqualityCompany,
  DirectorateOfEqualityDistribution,
  DirectorateOfEqualityEqualityPlan,
  DirectorateOfEqualityGap,
  DirectorateOfEqualityGapDirection,
  DirectorateOfEqualityGender,
  DirectorateOfEqualityPayComponents,
  DirectorateOfEqualityReport,
  DirectorateOfEqualitySubmission,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './types'

export type MockScenario =
  | 'default'
  | 'planOnly'
  | 'notObliged'
  | 'noSubmissions'
export const MOCK_SCENARIO = 'default' as MockScenario

export const MOCK_COMPANY: DirectorateOfEqualityCompany = {
  name: 'Fyrirtækið ehf.',
  nationalId: '1234567890',
  employeeCountRange: '50+',
  isatCategory: '62.01 Hugbúnaðargerð',
  equalityPlanRequired: MOCK_SCENARIO !== 'notObliged',
  nextEqualityPlanDeadline:
    MOCK_SCENARIO === 'notObliged' ? null : '2027-03-01',
  salaryReportRequired:
    MOCK_SCENARIO === 'default' || MOCK_SCENARIO === 'noSubmissions',
  nextSalaryReportDeadline:
    MOCK_SCENARIO === 'default' || MOCK_SCENARIO === 'noSubmissions'
      ? '2027-02-28'
      : null,
}

export const MOCK_PLAN_SUBMISSIONS: DirectorateOfEqualitySubmission[] =
  MOCK_SCENARIO === 'noSubmissions'
    ? []
    : [
        {
          id: 'ja-2025-00231',
          type: DirectorateOfEqualitySubmissionType.EQUALITY_PLAN,
          status: DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
          submittedAt: '2025-10-14',
          periodFrom: 2025,
          periodTo: 2028,
          year: null,
        },
        {
          id: 'ja-2022-00187',
          type: DirectorateOfEqualitySubmissionType.EQUALITY_PLAN,
          status: DirectorateOfEqualitySubmissionStatus.APPROVED,
          submittedAt: '2022-03-03',
          periodFrom: 2022,
          periodTo: 2025,
          year: null,
        },
        {
          id: 'ja-2019-00042',
          type: DirectorateOfEqualitySubmissionType.EQUALITY_PLAN,
          status: DirectorateOfEqualitySubmissionStatus.APPROVED,
          submittedAt: '2019-02-28',
          periodFrom: 2019,
          periodTo: 2022,
          year: null,
        },
      ]

export const MOCK_REPORT_SUBMISSIONS: DirectorateOfEqualitySubmission[] =
  MOCK_SCENARIO === 'noSubmissions'
    ? []
    : [
        {
          id: 'lg-2025-00102',
          type: DirectorateOfEqualitySubmissionType.SALARY_REPORT,
          status: DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
          submittedAt: '2025-09-30',
          periodFrom: null,
          periodTo: null,
          year: 2025,
        },
        {
          id: 'lg-2024-00051',
          type: DirectorateOfEqualitySubmissionType.SALARY_REPORT,
          status: DirectorateOfEqualitySubmissionStatus.APPROVED,
          submittedAt: '2024-02-29',
          periodFrom: null,
          periodTo: null,
          year: 2023,
        },
        {
          id: 'lg-2023-00019',
          type: DirectorateOfEqualitySubmissionType.SALARY_REPORT,
          status: DirectorateOfEqualitySubmissionStatus.REJECTED,
          submittedAt: '2023-03-15',
          periodFrom: null,
          periodTo: null,
          year: 2022,
        },
      ]

export const MOCK_EQUALITY_PLANS: DirectorateOfEqualityEqualityPlan[] = [
  {
    id: 'ja-2022-00187',
    identifier: 'JA-2022-00187',
    status: DirectorateOfEqualitySubmissionStatus.APPROVED,
    submittedAt: '2022-03-03',
    approvedAt: '2022-04-12',
    validUntil: '2025-12-31',
    periodFrom: 2022,
    periodTo: 2025,
    companyName: 'Fyrirtækið ehf.',
    companyNationalId: '1234567890',
    fileName: 'jafnrettisaetlun-2022-2025.pdf',
  },
  {
    id: 'ja-2019-00042',
    identifier: 'JA-2019-00042',
    status: DirectorateOfEqualitySubmissionStatus.APPROVED,
    submittedAt: '2019-02-28',
    approvedAt: '2019-04-10',
    validUntil: '2022-12-31',
    periodFrom: 2019,
    periodTo: 2022,
    companyName: 'Fyrirtækið ehf.',
    companyNationalId: '1234567890',
    fileName: 'jafnrettisaetlun-2019-2022.pdf',
  },
]

const expectedWage = (score: number) => 1112 * Math.exp(0.002897 * score)
const MALE_OUTLIERS: Record<number, number> = { 6: 1.45 }
const FEMALE_OUTLIERS: Record<number, number> = { 10: 0.7, 20: 1.4, 25: 1.4 }

const buildDistribution = (
  withOutliers: boolean,
): DirectorateOfEqualityDistribution => {
  const male = Array.from({ length: 20 }, (_, i) => {
    const score = 450 + i * 22
    const outlier = withOutliers ? MALE_OUTLIERS[i] : undefined
    const factor = outlier ?? 1 + (((i * 7) % 11) - 5) / 50
    return {
      score,
      wage: Math.round(expectedWage(score) * factor),
      gender: DirectorateOfEqualityGender.MALE,
      isOutlier: outlier !== undefined,
    }
  })
  const female = Array.from({ length: 30 }, (_, i) => {
    const score = 430 + i * 6
    const outlier = withOutliers ? FEMALE_OUTLIERS[i] : undefined
    const factor = outlier ?? 1 + (((i * 5) % 9) - 4) / 40
    return {
      score,
      wage: Math.round(expectedWage(score) * factor),
      gender: DirectorateOfEqualityGender.FEMALE,
      isOutlier: outlier !== undefined,
    }
  })
  return {
    points: [...male, ...female],
    expectedLine: Array.from({ length: 20 }, (_, i) => {
      const score = 400 + i * 25
      return { score, wage: Math.round(expectedWage(score)) }
    }),
    increasePer100PointsPercent: 33.6,
    expectedWageAtMeanScore: 5638,
  }
}

export const MOCK_PAY_COMPONENTS: DirectorateOfEqualityPayComponents = {
  male: { count: 20, additional: 64100, bonus: 28125, total: 92225 },
  female: { count: 30, additional: 21900, bonus: 32167, total: 54067 },
  all: { count: 50, additional: 38780, bonus: 30550, total: 69330 },
  additionalGapPercent: 65.8,
  bonusGapPercent: -14.4,
  totalGapPercent: 41.4,
}

const RAW_GAP: DirectorateOfEqualityGap = {
  percent: 36.03,
  direction: DirectorateOfEqualityGapDirection.WOMEN,
}

export const MOCK_REPORTS: DirectorateOfEqualityReport[] = [
  {
    id: 'lg-2024-00051',
    identifier: 'LG-2024-00051',
    status: DirectorateOfEqualitySubmissionStatus.APPROVED,
    submittedAt: '2024-02-29',
    approvedAt: '2024-05-22',
    year: 2023,
    analysisPeriod: 'Meðaltal á tólf mánaða tímabili',
    companyName: 'Fyrirtækið ehf.',
    companyNationalId: '1234567890',
    adjustedGap: {
      percent: 8.5,
      direction: DirectorateOfEqualityGapDirection.WOMEN,
      benchmarkPercent: 3.9,
      withinBenchmark: false,
      outlierCount: 4,
    },
    rawGap: RAW_GAP,
    meanHourlyWage: { male: 7631, female: 4882 },
    distribution: buildDistribution(true),
    payComponents: MOCK_PAY_COMPONENTS,
    improvementPlan: [
      {
        reason: 'Sérhæfð þekking og ábyrgð umfram starfslýsingu',
        correctionPlan:
          'Störf endurmetin og laun leiðrétt við næstu launaendurskoðun',
        deadline: '2026-11-25',
        responsibleName: 'Anna Jónsdóttir',
        responsibleTitle: 'Mannauðsstjóri',
      },
    ],
  },
  {
    id: 'lg-2023-00019',
    identifier: 'LG-2023-00019',
    status: DirectorateOfEqualitySubmissionStatus.REJECTED,
    submittedAt: '2023-03-15',
    approvedAt: null,
    year: 2022,
    analysisPeriod: 'Meðaltal á tólf mánaða tímabili',
    companyName: 'Fyrirtækið ehf.',
    companyNationalId: '1234567890',
    adjustedGap: {
      percent: 2.1,
      direction: DirectorateOfEqualityGapDirection.WOMEN,
      benchmarkPercent: 3.9,
      withinBenchmark: true,
      outlierCount: 0,
    },
    rawGap: RAW_GAP,
    meanHourlyWage: { male: 7631, female: 4882 },
    distribution: buildDistribution(false),
    payComponents: MOCK_PAY_COMPONENTS,
    improvementPlan: [],
  },
]
