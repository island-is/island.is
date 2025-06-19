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
import { Application } from '@island.is/application/types'
import { IncomeCheckboxValues } from '../../utils/enums'

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: income.general.sectionTitle,
  children: [
    buildMultiField({
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
          id: 'income.endOfEmployment',
          title: income.labels.endOfEmployment,
          titleVariant: 'h5',
        }),
        buildDateField({
          id: 'income.endOfEmploymentDate',
          title: income.labels.endOfEmploymentDate,
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
              value: IncomeCheckboxValues.STILL_EMPLOYED,
              label: income.labels.stillEmployed,
            },
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
        }),
        buildTextField({
          id: 'income.explanation',
          title: income.labels.explanation,
          placeholder: income.labels.explanationPlaceholder,
          variant: 'textarea',
          rows: 4,
          maxLength: 200, // TODO Get actual max number
          showMaxLength: true,
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
        // When to use leave, Repeatable to and from date field
      ],
    }),
  ],
})
