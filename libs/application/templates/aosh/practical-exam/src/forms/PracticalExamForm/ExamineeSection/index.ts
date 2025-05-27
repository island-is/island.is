import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
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
            },
            email: {
              component: 'input',
              label: shared.labels.email,
              width: 'half',
              type: 'email',
            },
            phone: {
              component: 'input',
              label: shared.labels.phone,
              type: 'tel',
              format: '###-####',
              placeholder: '000-0000',
              width: 'half',
            },
            licenseNumber: {
              component: 'input',
              label: examinee.labels.licenceNumber,
              width: 'half',
              displayInTable: false,
            },
            countryIssuer: {
              component: 'select',
              label: examinee.labels.countryIssuer,
              placeholder: examinee.labels.pickCountry,
              width: 'half',
              displayInTable: false,
              options: getAllCountryCodes().map((country) => ({
                label: country.name,
                value: country.name,
              })),
            },
          },
          table: {
            format: {
              nationalId: (value) => `${value.slice(0, 6)}-${value.slice(6)}`,
              phone: (value) => `${value.slice(0, 3)}-${value.slice(3)}`,
            },
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
