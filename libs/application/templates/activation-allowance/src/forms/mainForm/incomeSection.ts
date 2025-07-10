import {
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { application, income } from '../../lib/messages'
import {
  Application,
  ExternalData,
  Field,
  MultiField,
} from '@island.is/application/types'
import { IncomeCheckboxValues } from '../../utils/enums'

const buildRepeatableSections = (): MultiField => {
  const incomeBlocks = [...Array(2)].map((_key, index) => {
    return getIncomeSections(index)
  })
  return buildMultiField({
    condition: (_, externalData: ExternalData) => {
      return true
    },
    title: income.general.pageTitle,
    children: incomeBlocks.flat(),
  })
}

const getIncomeSections = (index: number) => {
  const fields: Field[] = [
    buildDescriptionField({
      id: `income[${index}].taxInfo`,
      description: 'Testing',
    }),
    buildTextField({
      id: `income[${index}].month`,
      readOnly: true,
      title: income.labels.incomeMonth,
      backgroundColor: 'white',
      defaultValue: (application: Application) => {
        return 'Apríl'
      },
      doesNotRequireAnswer: true,
    }),
    buildTextField({
      id: `income[${index}].salaryIncome`,
      readOnly: true,
      variant: 'currency',
      title: income.labels.salaryIncome,
      backgroundColor: 'white',
      defaultValue: (application: Application) => {
        return 1000000
      },
      doesNotRequireAnswer: true,
    }),
    buildTextField({
      id: `income[${index}].employer`,
      readOnly: true,
      title: income.labels.employer,
      backgroundColor: 'white',
      defaultValue: (application: Application) => {
        return 'Fyrirtæki ehf.'
      },
      marginBottom: 4,
      doesNotRequireAnswer: true,
    }),

    buildDescriptionField({
      id: `income[${index}].hasEmploymentEndedDescription`,
      title: income.labels.hasEmploymentEnded,
      titleVariant: 'h5',
    }),
    buildRadioField({
      id: `income[${index}].hasEmploymentEnded`,
      width: 'half',
      options: [
        { value: YES, label: application.yesLabel },
        { value: NO, label: application.noLabel },
      ],
      doesNotRequireAnswer: true,
    }),
    buildDescriptionField({
      id: `income[${index}].endOfEmployment`,
      title: income.labels.endOfEmployment,
      titleVariant: 'h5',
      doesNotRequireAnswer: true,
      //condition: employmentHasNotEnded
    }),
    buildDateField({
      id: `income[${index}].endOfEmploymentDate`,
      title: income.labels.endOfEmploymentDate,
      doesNotRequireAnswer: true,
      //condition: employmentHasNotEnded
      minDate: () => {
        const today = new Date()
        const threeMonthsAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate(),
        )
        return threeMonthsAgo
      },

      maxDate: () => {
        const today = new Date()
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        )
        return endOfMonth
      },
    }),
    buildCheckboxField({
      id: `income[${index}].checkbox`,
      options: [
        {
          value: IncomeCheckboxValues.INCOME_FROM_OTHER_THAN_JOB,
          label: income.labels.incomeFromOtherThanJob,
        },
      ],
      doesNotRequireAnswer: true,
    }),
    buildDescriptionField({
      id: `income[${index}].explanationDescription`,
      title: income.labels.explanationDescription,
      titleVariant: 'h5',
      //condition: incommeFromOtherThanJobChecked
    }),
    buildTextField({
      id: `income[${index}].explanation`,
      title: income.labels.explanation,
      placeholder: income.labels.explanationPlaceholder,
      variant: 'textarea',
      rows: 4,
      maxLength: 200, // TODO Get actual max number
      showMaxLength: true,
      doesNotRequireAnswer: true,
      //condition: incomeFromOtherThanJobChecked
    }),

    buildDescriptionField({
      id: `income[${index}].leaveDescription`,
      title: income.labels.leaveDescription,
      titleVariant: 'h5',
    }),
    buildRadioField({
      id: `income[${index}].hasLeaveDays`,
      width: 'half',
      options: [
        { value: YES, label: application.yesLabel },
        { value: NO, label: application.noLabel },
      ],
      doesNotRequireAnswer: true,
    }),

    buildDescriptionField({
      id: `income[${index}].numberAndUsageOfLeaveDescription`,
      title: income.labels.numberAndUsageOfLeaveDescription,
      titleVariant: 'h5',
    }),
    buildTextField({
      id: `income[${index}].numberOfLeaveDays`,
      title: income.labels.numberOfLeaveDays,
      variant: 'number',
      min: 1,
      max: 99,
      doesNotRequireAnswer: true,
    }),
    buildFieldsRepeaterField({
      id: `income[${index}].leaveDates`,
      fields: {
        dateFrom: {
          component: 'date',
          label: income.labels.dateFrom,
          width: 'half',
        },
        dateTo: {
          component: 'date',
          label: income.labels.dateTo,
          width: 'half',
        },
      },
      addItemButtonText: income.labels.addLine,
      formTitleNumbering: 'none',
      doesNotRequireAnswer: true,
    }),
  ]

  return fields
}

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: income.general.sectionTitle,
  condition: () => false,
  children: [buildRepeatableSections()],
})
