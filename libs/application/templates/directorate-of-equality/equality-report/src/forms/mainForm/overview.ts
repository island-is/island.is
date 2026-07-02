import {
  buildCustomField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overview',
  title: messages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: messages.overview.title,
      description: messages.overview.intro,
      children: [
        buildOverviewField({
          id: 'overview.companyInfo',
          title: messages.overview.companyInfo,
          titleVariant: 'h3',
          backId: 'generalInformationMultiField',
          items: (answers) => [
            {
              width: 'half',
              keyText: messages.aboutTheCompany.generalInformation.companyName,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.companyName',
                ) ?? '',
            },
            {
              width: 'half',
              keyText: messages.aboutTheCompany.generalInformation.nationalId,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.nationalId',
                ) ?? '',
            },
            {
              width: 'half',
              keyText: messages.aboutTheCompany.generalInformation.address,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.address',
                ) ?? '',
            },
            {
              width: 'half',
              keyText: messages.aboutTheCompany.generalInformation.postalCode,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.postalCode',
                ) ?? '',
            },
            {
              width: 'half',
              keyText: messages.aboutTheCompany.generalInformation.municipality,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.municipality',
                ) ?? '',
            },
            {
              width: 'half',
              keyText:
                messages.aboutTheCompany.generalInformation.numberOfEmployees,
              valueText:
                getValueViaPath<string>(
                  answers,
                  'generalInformation.numberOfEmployees',
                ) ?? '',
            },
            {
              width: 'full',
              keyText:
                messages.aboutTheCompany.generalInformation.isatClassification,
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
          backId: 'chiefExecutiveMultiField',
          items: (answers) => {
            const gender = getValueViaPath<string>(
              answers,
              'chiefExecutive.gender',
            )
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
                keyText: messages.aboutTheCompany.chiefExecutive.email,
                valueText:
                  getValueViaPath<string>(answers, 'chiefExecutive.email') ??
                  '',
              },
              {
                width: 'half',
                keyText: messages.aboutTheCompany.chiefExecutive.gender,
                valueText: genderText,
              },
              {
                width: 'half',
                keyText: messages.aboutTheCompany.chiefExecutive.jobTitle,
                valueText:
                  getValueViaPath<string>(answers, 'chiefExecutive.jobTitle') ??
                  '',
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overview.contactPerson',
          title: messages.overview.contactPerson,
          titleVariant: 'h3',
          backId: 'contactPersonMultiField',
          items: (answers) => [
            {
              width: 'half',
              keyText: messages.aboutTheCompany.contactPerson.name,
              valueText:
                getValueViaPath<string>(answers, 'contactPerson.name') ?? '',
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
          backId: 'employeeCountMultiField',
          items: (answers) => [
            {
              width: 'half',
              keyText: messages.overview.women,
              valueText:
                getValueViaPath<string>(answers, 'employeeCount.women') ?? '',
            },
            {
              width: 'half',
              keyText: messages.overview.men,
              valueText:
                getValueViaPath<string>(answers, 'employeeCount.men') ?? '',
            },
            {
              width: 'half',
              keyText: messages.overview.nonBinary,
              valueText:
                getValueViaPath<string>(answers, 'employeeCount.nonBinary') ??
                '',
            },
          ],
        }),
        buildCustomField({
          id: 'overview.display',
          title: '',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          title: messages.overview.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: messages.overview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
