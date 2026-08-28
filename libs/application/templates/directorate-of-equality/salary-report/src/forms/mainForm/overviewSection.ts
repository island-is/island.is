import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { PERIOD_ONE_MONTH } from '../../utils/constants'
import { salaryAnalysisOutlierPlanIsReviewed } from '../../utils/salaryAnalysisNavigation'

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

// Basic overview — mirrors the equality report. Company / contact blocks for
// now; the report + salary-analysis summary will be added later.
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
