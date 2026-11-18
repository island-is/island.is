import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
  coreMessages,
} from '@island.is/application/core'
import { examinee, shared } from '../../../lib/messages'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { FormValue } from '@island.is/application/types'
import { SelfOrOthers, TrueOrFalse } from '../../../utils/enums'
import { submitExaminees } from '../../../utils/submitExaminees'
import { ExamineeType } from '../../../lib/dataSchema'
export const examineeSection = buildSection({
  id: 'examineeSection',
  title: examinee.general.sectionTitle,
  condition: (answers: FormValue) => {
    const selfOrOthers = getValueViaPath<SelfOrOthers>(
      answers,
      'information.selfOrOthers',
    )
    return selfOrOthers === SelfOrOthers.others
  },
  children: [
    buildMultiField({
      title: examinee.general.pageTitle,
      id: 'examineesMultiField',
      description: examinee.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'examinees',
          fields: {
            nationalId: {
              component: 'nationalIdWithName',
              label: shared.labels.ssn,
              required: true,
            },
            email: {
              component: 'input',
              label: shared.labels.email,
              width: 'half',
              type: 'email',
              required: true,
            },
            phone: {
              component: 'input',
              label: shared.labels.phone,
              type: 'tel',
              format: '###-####',
              placeholder: '000-0000',
              width: 'half',
              required: true,
            },
            licenseNumber: {
              component: 'input',
              label: examinee.labels.licenceNumber,
              width: 'half',
              displayInTable: false,
              required: true,
            },
            countryIssuer: {
              component: 'select',
              label: examinee.labels.countryIssuer,
              placeholder: examinee.labels.pickCountry,
              width: 'half',
              displayInTable: false,
              required: true,
              options: ({ locale }) => {
                const iceland = {
                  name: 'Iceland',
                  name_is: 'Ísland',
                  format: '###-####',
                  flag: '🇮🇸',
                  code: 'IS',
                  dial_code: '+354',
                }
                const countries = getAllCountryCodes().filter(
                  (country) => country.code !== 'IS' || '',
                )

                const getLocalizedName = (name: string, nameIs?: string) =>
                  locale === 'is' ? nameIs || name : name

                return [
                  {
                    label: getLocalizedName(iceland.name, iceland.name_is),
                    value: iceland.name_is,
                  },
                  ...countries.map((country) => ({
                    label: getLocalizedName(country.name, country.name_is),
                    value: getLocalizedName(country.name, country.name_is),
                  })),
                ]
              },
            },
          },
          table: {
            rowProps: ({ row }) => ({ disabled: row.disabled === 'true' }),
            columns: [
              { header: coreMessages.name, value: 'name' },
              { header: coreMessages.nationalId, value: 'nationalId' },
              { header: shared.labels.email, value: 'email' },
              {
                header: shared.labels.phone,
                value: ({ row }) => {
                  const value = row.phone ?? ''
                  return `${value.slice(0, 3)}-${value.slice(3)}`
                },
              },
            ],
          },
          onSubmitLoad: async ({ apolloClient, application, tableItems }) => {
            const validationPaths = await submitExaminees(
              apolloClient,
              application,
              tableItems,
            )

            return { dictionaryOfItems: validationPaths }
          },
        }),
        buildCustomField({
          id: 'examineesCSV',
          doesNotRequireAnswer: true,
          component: 'ExamineesCSVUploader',
        }),
        buildAlertMessageField({
          id: 'examineesValidityError',
          alertType: 'warning',
          condition: (formValue: FormValue, _) => {
            const examinees = getValueViaPath<ExamineeType>(
              formValue,
              'examinees',
            )
            const hasDisabled = examinees?.some(
              (examinee) => examinee.disabled === TrueOrFalse.true,
            )

            return hasDisabled || false
          },
          title: examinee.tableRepeater.examineeValidityErrorTitle,
          message: examinee.tableRepeater.examineeValidityError,
        }),
        buildAlertMessageField({
          id: 'examineesGraphQLError',
          alertType: 'error',
          condition: (formValue: FormValue, _) => {
            const hasError = getValueViaPath<string>(
              formValue,
              'examineesGraphQLError',
              'false',
            )

            return hasError === 'true'
          },
          title: examinee.tableRepeater.examineesGraphQLErrorTitle,
          message: examinee.tableRepeater.examineesGraphQLError,
        }),
        buildCustomField({
          id: 'examinees.examineeValidation',
          doesNotRequireAnswer: true,
          component: 'ExamineeValidation',
        }),
      ],
    }),
  ],
})
