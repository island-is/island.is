import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, type FormValue } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { PERIOD_ONE_MONTH, ScreenIds } from '../../utils/constants'
import {
  getBenchmarkVerdict,
  isPostponeRequested,
  salaryAnalysisNeedsImprovementPlan,
  salaryAnalysisOutlierPlanIsReviewed,
} from '../../utils/salaryAnalysisNavigation'
import { buildOutlierPlanOverviewField } from '../outlierPlanOverview'

const MONTH_LABELS = [
  messages.aboutTheCompany.period.january,
  messages.aboutTheCompany.period.february,
  messages.aboutTheCompany.period.march,
  messages.aboutTheCompany.period.april,
  messages.aboutTheCompany.period.may,
  messages.aboutTheCompany.period.june,
  messages.aboutTheCompany.period.july,
  messages.aboutTheCompany.period.august,
  messages.aboutTheCompany.period.september,
  messages.aboutTheCompany.period.october,
  messages.aboutTheCompany.period.november,
  messages.aboutTheCompany.period.december,
]

// Shared with the POSTPONED-state report recap (postponedReportSummarySection)
// — that screen shows the same submitted-report fields read-only, with no
// backId, since it has no editable company/contact screens of its own to
// jump back to.
export const buildReportOverviewFields = (withBackLinks: boolean) => [
  buildOverviewField({
    id: 'overview.companyInfo',
    title: messages.overview.companyInfo,
    titleVariant: 'h3',
    ...(withBackLinks ? { backId: 'generalInformationMultiField' } : {}),
    items: (answers) => [
      {
        width: 'half',
        keyText: messages.aboutTheCompany.generalInformation.companyName,
        valueText:
          getValueViaPath<string>(answers, 'generalInformation.companyName') ??
          '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.generalInformation.nationalId,
        valueText:
          getValueViaPath<string>(answers, 'generalInformation.nationalId') ??
          '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.generalInformation.address,
        valueText:
          getValueViaPath<string>(answers, 'generalInformation.address') ?? '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.generalInformation.municipality,
        valueText:
          getValueViaPath<string>(answers, 'generalInformation.municipality') ??
          '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.generalInformation.numberOfEmployees,
        valueText:
          getValueViaPath<string>(
            answers,
            'generalInformation.numberOfEmployees',
          ) ?? '',
      },
      {
        width: 'full',
        keyText: messages.aboutTheCompany.generalInformation.isatClassification,
        valueText:
          getValueViaPath<string>(
            answers,
            'generalInformation.isatClassification',
          ) ?? '',
      },
    ],
  }),
  buildOverviewField({
    id: 'overview.chiefExecutive',
    title: messages.overview.chiefExecutive,
    titleVariant: 'h3',
    ...(withBackLinks ? { backId: 'chiefExecutiveMultiField' } : {}),
    items: (answers) => {
      const gender = getValueViaPath<string>(answers, 'chiefExecutive.gender')
      const genderText =
        gender === 'MALE'
          ? messages.aboutTheCompany.chiefExecutive.genderMale
          : gender === 'FEMALE'
          ? messages.aboutTheCompany.chiefExecutive.genderFemale
          : gender === 'NON_BINARY'
          ? messages.aboutTheCompany.chiefExecutive.genderNonBinary
          : '—'
      return [
        {
          width: 'half',
          keyText: messages.aboutTheCompany.chiefExecutive.name,
          valueText:
            getValueViaPath<string>(answers, 'chiefExecutive.name') ?? '',
        },
        {
          width: 'half',
          keyText: messages.aboutTheCompany.chiefExecutive.gender,
          valueText: genderText,
        },
        {
          width: 'half',
          keyText: messages.aboutTheCompany.chiefExecutive.email,
          valueText:
            getValueViaPath<string>(answers, 'chiefExecutive.email') ?? '',
        },
        {
          width: 'half',
          keyText: messages.overview.chiefExecutiveJobTitleLabel,
          valueText:
            getValueViaPath<string>(answers, 'chiefExecutive.jobTitle') ?? '',
        },
      ]
    },
  }),
  buildOverviewField({
    id: 'overview.contactPerson',
    title: messages.overview.contactPerson,
    titleVariant: 'h3',
    ...(withBackLinks ? { backId: 'contactPersonMultiField' } : {}),
    items: (answers) => [
      {
        width: 'half',
        keyText: messages.aboutTheCompany.contactPerson.name,
        valueText: getValueViaPath<string>(answers, 'contactPerson.name') ?? '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.contactPerson.email,
        valueText:
          getValueViaPath<string>(answers, 'contactPerson.email') ?? '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.contactPerson.phone,
        valueText:
          getValueViaPath<string>(answers, 'contactPerson.phone') ?? '',
      },
    ],
  }),
  buildOverviewField({
    id: 'overview.period',
    title: messages.overview.periodLabel,
    titleVariant: 'h3',
    ...(withBackLinks ? { backId: 'periodMultiField' } : {}),
    items: (answers) => {
      const period = getValueViaPath<string>(answers, 'period.period')
      const isOneMonth = period === PERIOD_ONE_MONTH
      const items = [
        {
          width: 'half' as const,
          keyText: messages.aboutTheCompany.period.label,
          valueText: isOneMonth
            ? messages.aboutTheCompany.period.oneMonth
            : messages.aboutTheCompany.period.medium12months,
        },
      ]
      if (!isOneMonth) return items
      const year = getValueViaPath<string>(answers, 'period.year') ?? ''
      const month = getValueViaPath<string>(answers, 'period.month')
      const monthLabel = month ? MONTH_LABELS[Number(month) - 1] : undefined
      return [
        ...items,
        {
          width: 'half' as const,
          keyText: messages.aboutTheCompany.period.year,
          valueText: monthLabel ? [monthLabel, year] : year,
        },
      ]
    },
  }),
]

// The verdict, not the figures: the analysis screen already renders the gap
// itself, and this row answers the one question the submission turns on.
//
// Read from answers, not from externalData. The form shell freezes its copy of
// externalData at mount and nothing here can refresh it, so reading
// salaryAnalysisResult directly would render "Liggur ekki fyrir" for the whole
// sitting in which the applicant actually ran the analysis. The analysis screen
// mirrors the verdict into answers for exactly this reason — see
// BenchmarkVerdict.
//
// The three-way mapping is deliberate: WageGapState keeps "no measurable gap"
// and "no result" apart from both verdicts, so neither may be reported as Nei.
const withinBenchmarkValue = (answers: FormValue) => {
  switch (getBenchmarkVerdict(answers)) {
    case 'within':
      return coreMessages.radioYes
    case 'over':
      return coreMessages.radioNo
    case 'notComputable':
      return messages.overview.withinBenchmarkNotComputable
    default:
      return messages.overview.withinBenchmarkUnknown
  }
}

// Basic overview — mirrors the equality report.
export const overviewSection = buildSection({
  id: 'overview',
  title: messages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: messages.overview.title,
      description: messages.overview.intro,
      children: [
        ...buildReportOverviewFields(true),
        buildOverviewField({
          id: 'overview.salaryAnalysis',
          title: messages.overview.salaryAnalysisTitle,
          titleVariant: 'h3',
          backId: ScreenIds.analysisOverview,
          items: (answers, externalData) => [
            {
              width: 'half',
              keyText: messages.overview.withinBenchmarkLabel,
              valueText: withinBenchmarkValue(answers),
            },
            // Postponing is only offered where there is a plan to postpone, so
            // the row only means anything there.
            ...(salaryAnalysisNeedsImprovementPlan(answers, externalData)
              ? [
                  {
                    width: 'half' as const,
                    keyText: messages.overview.postponeLabel,
                    valueText: isPostponeRequested(answers)
                      ? coreMessages.radioYes
                      : coreMessages.radioNo,
                  },
                ]
              : []),
          ],
        }),
        buildOutlierPlanOverviewField({
          id: 'overview.outlierPlan',
          title: messages.overview.outlierPlanTitle,
          backId: ScreenIds.improvementPlan,
        }),
        buildSubmitField({
          id: 'submit',
          title: messages.overview.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: messages.overview.submitButton,
              type: 'primary',
              condition: salaryAnalysisOutlierPlanIsReviewed,
            },
          ],
        }),
      ],
    }),
  ],
})
