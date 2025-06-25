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
  MultiField,
} from '@island.is/application/types'
import { IncomeCheckboxValues } from '../../utils/enums'

const buildRepeatableSections = (): MultiField[] => {
  const sections = [...Array(5)].map((_key, index) => {
    return getIncomeSections(index)
  })
  return sections.flat()
}

const getIncomeSections = (index: number) => {
  return buildMultiField({
    condition: (_, externalData: ExternalData) => {
      return true
    },
    title: income.general.pageTitle,
    children: [
      buildDescriptionField({
        id: 'income.taxInfo',
        description: 'Testing',
      }),
      buildTextField({
        id: 'income.month',
        readOnly: true,
        title: income.labels.incomeMonth,
        backgroundColor: 'white',
        defaultValue: (application: Application) => {
          return 'Apríl'
        },
      }),
      buildTextField({
        id: 'income.salaryIncome',
        readOnly: true,
        variant: 'currency',
        title: income.labels.salaryIncome,
        backgroundColor: 'white',
        defaultValue: (application: Application) => {
          return 1000000
        },
      }),
      buildTextField({
        id: 'income.employer',
        readOnly: true,
        title: income.labels.employer,
        backgroundColor: 'white',
        defaultValue: (application: Application) => {
          return 'Fyrirtæki ehf.'
        },
        marginBottom: 4,
      }),

      buildDescriptionField({
        id: 'income.hasEmploymentEndedDescription',
        title: income.labels.hasEmploymentEnded,
        titleVariant: 'h5',
      }),
      buildRadioField({
        id: 'income.hasEmploymentEnded',
        width: 'half',
        options: [
          { value: YES, label: application.yesLabel },
          { value: NO, label: application.noLabel },
        ],
      }),
      buildDescriptionField({
        id: 'income.endOfEmployment',
        title: income.labels.endOfEmployment,
        titleVariant: 'h5',
        //condition: employmentHasNotEnded
      }),
      buildDateField({
        id: 'income.endOfEmploymentDate',
        title: income.labels.endOfEmploymentDate,
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
        id: 'income.checkbox',
        options: [
          {
            value: IncomeCheckboxValues.INCOME_FROM_OTHER_THAN_JOB,
            label: income.labels.incomeFromOtherThanJob,
          },
        ],
      }),
      buildDescriptionField({
        id: 'income.explanationDescription',
        title: income.labels.explanationDescription,
        titleVariant: 'h5',
        //condition: incommeFromOtherThanJobChecked
      }),
      buildTextField({
        id: 'income.explanation',
        title: income.labels.explanation,
        placeholder: income.labels.explanationPlaceholder,
        variant: 'textarea',
        rows: 4,
        maxLength: 200, // TODO Get actual max number
        showMaxLength: true,
        //condition: incommeFromOtherThanJobChecked
      }),

      buildDescriptionField({
        id: 'income.leaveDescription',
        title: income.labels.leaveDescription,
        titleVariant: 'h5',
      }),
      buildRadioField({
        id: 'income.hasLeaveDays',
        width: 'half',
        options: [
          { value: YES, label: application.yesLabel },
          { value: NO, label: application.noLabel },
        ],
      }),

      buildDescriptionField({
        id: 'income.numberAndUsageOfLeaveDescription',
        title: income.labels.numberAndUsageOfLeaveDescription,
        titleVariant: 'h5',
      }),
      buildTextField({
        id: 'income.numberOfLeaveDays',
        title: income.labels.numberOfLeaveDays,
        variant: 'number',
        min: 1,
        max: 99,
      }),
      buildFieldsRepeaterField({
        id: 'income.leaveDates',
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
      }),
    ],
  })
}

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: income.general.sectionTitle,
  children: [...buildRepeatableSections()],
})
