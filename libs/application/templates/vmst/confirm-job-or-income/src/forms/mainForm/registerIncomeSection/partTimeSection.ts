import {
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import {
  hasPartTimeCasualWorkOverlap,
  hasPartTimeOverlap,
  isPartTime,
} from '../../../utils/conditions'
import {
  getMaxRegistrationDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsCurrency, formatIsDate } from '../../../utils/formatters'
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import { buildIncomeDescriptionFields } from './incomeDescriptionFields'
import {
  buildEmployerSSNDelete,
  buildPersistedRowProps,
} from '../../../utils/reconcile'
import {
  getPartTimeDefaults,
  toPartTimeRow,
} from '../../../utils/persistedRows'
import {
  getCompanyNationalId,
  toOptionalNumber,
  toOptionalString,
  toRequiredString,
} from '../../../utils/rowCoercions'

const partTimeValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerPartTime',
  incomeTypeKey: 'partTimeJobs',
  persistedPath: 'income.data.partTimeJobs',
  toRow: toPartTimeRow,
  callbackId: 'PartTimeValidation',
  messages: {
    fallbackErrorMessage: 'partTimeValidationErrorMessage',
  },
  buildDelete: buildEmployerSSNDelete,
  rowToInput: (row) => ({
    validationId: toRequiredString(row.validationId),
    employerSSN: getCompanyNationalId(row),
    periodFrom: toRequiredString(row.jobStart),
    periodTo: toOptionalString(row.jobEnd),
    ratio: toOptionalNumber(row.workPercentage),
    estimatedIncome: toOptionalNumber(row.estimatedIncome),
  }),
}

export const partTimeSection = buildSubSection({
  id: 'partTimeSection',
  title: m.application.partTimeHeading,
  condition: isPartTime,
  children: [
    buildMultiField({
      id: 'partTimeMultiField',
      title: m.application.partTimeHeading,
      description: m.application.partTimeDescription,
      children: [
        buildAlertMessageField({
          id: 'partTimeAlert',
          message: m.application.partTimeAlert,
          alertType: 'info',
        }),
        ...buildIncomeDescriptionFields('partTimeDescription'),
        buildTableRepeaterField({
          id: 'registerPartTime',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getPartTimeDefaults,
          removeButtonDisabledTooltipText: m.application.removeLineNotAllowed,
          editField: true,
          editButtonDisabledTooltipText: m.application.editLineNotAllowed,
          marginTop: 2,
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
              customNationalIdLabel: m.application.companyNationalId,
              customNameLabel: m.application.companyName,
            },
            jobStart: {
              component: 'date',
              label: m.application.jobStart,
              width: 'half',
              required: true,
              clearOnChange: ({ index }) => [
                `registerPartTime[${index}].jobEnd`,
              ],
              minDate: () => getCurrentMonthStartDate(),
              maxDate: () => getMaxRegistrationDate(),
            },
            jobEnd: {
              component: 'date',
              label: m.application.jobEnd,
              width: 'half',
              placeholder: m.application.indefinitePeriod,
              maxDate: () => getMaxRegistrationDate(),
              minDate: ({ row: activeField }) => {
                const fromDate = activeField?.jobStart
                if (fromDate) {
                  return new Date(fromDate)
                }
                return getCurrentMonthStartDate()
              },
            },
            workPercentage: {
              component: 'input',
              label: m.application.workPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
              required: true,
              min: 0,
              max: 100,
            },
            estimatedIncome: {
              component: 'input',
              label: m.application.estimatedMonthlyIncome,
              width: 'half',
              type: 'number',
              currency: true,
              required: true,
              min: 0,
            },
            // Correlates each row with the 3rd party validation response.
            // Reuse the row's existing id if it already has one; otherwise this
            // function re-runs on every render and generating a fresh uuid each
            // time causes an infinite update loop.
            validationId: {
              component: 'hiddenInput',
              defaultValue: ({ row: activeField }) =>
                activeField?.validationId ?? uuid(),
            },
          },
          table: {
            columns: [
              {
                header: m.application.tableHeaderNationalId,
                value: ({ row }) => {
                  const value = row.nationalId ?? ''
                  if (!value) return ''
                  const clean = value.replace('-', '')
                  return `${clean.slice(0, 6)}\u2011${clean.slice(6)}`
                },
              },
              {
                header: m.application.tableHeaderCompany,
                value: 'company.name',
              },
              {
                header: m.application.tableHeaderWorkPercentage,
                value: ({ row }) => {
                  const value = row.workPercentage ?? ''
                  if (!value) return ''
                  return `${value}%`
                },
              },
              {
                header: m.application.tableHeaderJobStart,
                value: ({ row }) => formatIsDate(row.jobStart ?? ''),
              },
              {
                header: m.application.tableHeaderEstimatedIncome,
                value: ({ row }) => formatIsCurrency(row.estimatedIncome ?? ''),
              },
            ],
            rowProps: buildPersistedRowProps(
              partTimeValidationProps.persistedPath,
            ),
          },
        }),
        buildAlertMessageField({
          id: 'partTimeOverlapAlert',
          title: m.errorMessages.partTimeOverlappingPeriods,
          message: m.errorMessages.partTimeOverlappingPeriodsAlertMessage,
          alertType: 'warning',
          marginTop: 6,
          condition: hasPartTimeOverlap,
        }),
        buildAlertMessageField({
          id: 'partTimeCasualWorkOverlapAlert',
          title: m.errorMessages.partTimeCasualWorkOverlappingPeriods,
          message:
            m.errorMessages.partTimeCasualWorkOverlappingPeriodsAlertMessage,
          alertType: 'warning',
          marginTop: 6,
          condition: hasPartTimeCasualWorkOverlap,
        }),
        buildCustomField(
          {
            id: 'partTimeValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          partTimeValidationProps,
        ),
      ],
    }),
  ],
})
