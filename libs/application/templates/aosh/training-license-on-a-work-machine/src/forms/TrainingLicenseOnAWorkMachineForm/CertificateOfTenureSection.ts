import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildDateField,
  buildCustomField,
  buildAlertMessageField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { certificateOfTenure } from '../../lib/messages'
import {
  alreadyHaveTrainingLicense,
  isUnknownMachineType,
  isUnknownPracticalRight,
  isWrongPracticalRight,
  isWrongPracticalRightWithInfo,
} from '../../utils'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: certificateOfTenure.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: certificateOfTenure.general.title,
      description: certificateOfTenure.general.description,
      children: [
        buildTextField({
          id: 'certificateOfTenure.machineNumber',
          title: certificateOfTenure.labels.machineNumber,
          width: 'half',
          required: true,
          clearOnChange: [
            'certificateOfTenure.machineType',
            'certificateOfTenure.practicalRight',
          ],
        }),
        buildCustomField({
          id: 'certificateOfTenure.machineType',
          title: '',
          width: 'half',
          component: 'SetAnswersForCertificateOfTenure',
        }),
        buildTextField({
          id: 'certificateOfTenure.practicalRight',
          title: certificateOfTenure.labels.practicalRight,
          readOnly: true,
          required: true,
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.unknownPracticalRight',
          title: '',
          message: certificateOfTenure.labels.unknownPracticalRight,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isUnknownPracticalRight(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.wrongPracticalRight',
          title: '',
          message: certificateOfTenure.labels.wrongPracticalRight,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isWrongPracticalRight(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.wrongPracticalRightWithInfo',
          title: '',
          message: (application) => {
            const listOfPossiblePracticalRights = getValueViaPath<string[]>(
              application.answers,
              'certificateOfTenure.listOfPossiblePracticalRights',
            )
            return {
              ...certificateOfTenure.labels.wrongPracticalRightWithInfo,
              values: {
                firstLetter: `${
                  listOfPossiblePracticalRights
                    ? listOfPossiblePracticalRights[0].charAt(0).toUpperCase()
                    : ''
                }`,
                allAggregates: `${
                  listOfPossiblePracticalRights
                    ? listOfPossiblePracticalRights.join(', ')
                    : ''
                }`,
              },
            }
          },
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isWrongPracticalRightWithInfo(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.unknownMachineType',
          title: '',
          message: certificateOfTenure.labels.unknownMachineType,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isUnknownMachineType(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.alreadyHaveTrainingLicense',
          title: '',
          message: certificateOfTenure.labels.alreadyHaveTrainingLicense,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => alreadyHaveTrainingLicense(answers),
        }),
        buildDateField({
          id: 'certificateOfTenure.dateFrom',
          title: certificateOfTenure.labels.dateFrom,
          width: 'half',
          required: true,
          placeholder: certificateOfTenure.labels.datePlaceholder,
          maxDate: (application) => {
            const dateTo = getValueViaPath<string>(
              application.answers,
              'certificateOfTenure.dateTo',
            )
            return dateTo
              ? new Date(
                  new Date(dateTo).setDate(new Date(dateTo).getDate() - 1),
                )
              : new Date()
          },
        }),
        buildDateField({
          id: 'certificateOfTenure.dateTo',
          title: certificateOfTenure.labels.dateTo,
          width: 'half',
          required: true,
          placeholder: certificateOfTenure.labels.datePlaceholder,
          minDate: (application) => {
            const dateFrom = getValueViaPath<string>(
              application.answers,
              'certificateOfTenure.dateFrom',
            )
            return dateFrom
              ? new Date(
                  new Date(dateFrom).setDate(new Date(dateFrom).getDate() + 1),
                )
              : new Date('1900-01-01')
          },
          maxDate: new Date(),
        }),
        buildTextField({
          id: 'certificateOfTenure.tenureInHours',
          title: certificateOfTenure.labels.tenureInHours,
          width: 'half',
          required: true,
          variant: 'number',
        }),
        buildHiddenInput({
          id: 'certificateOfTenure.licenseCategoryPrefix',
        }),
      ],
    }),
  ],
})
