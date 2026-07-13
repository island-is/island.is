import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { messages } from '../../lib/messages'

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
    id: 'overview.employeeCount',
    title: messages.overview.employeeCount,
    titleVariant: 'h3',
    ...(withBackLinks ? { backId: 'employeeCountMultiField' } : {}),
    items: (answers) => [
      {
        width: 'half',
        keyText: messages.aboutTheCompany.employeeCount.women,
        valueText:
          getValueViaPath<string>(answers, 'employeeCount.women') ?? '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.employeeCount.men,
        valueText: getValueViaPath<string>(answers, 'employeeCount.men') ?? '',
      },
      {
        width: 'half',
        keyText: messages.aboutTheCompany.employeeCount.nonBinary,
        valueText:
          getValueViaPath<string>(answers, 'employeeCount.nonBinary') ?? '',
      },
    ],
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
            },
          ],
        }),
      ],
    }),
  ],
})
