import {
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
  buildTitleField,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { hasPartTimeOverlap, isPartTime } from '../../../utils/conditions'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsCurrency, formatIsDateLong } from '../../../utils/formatters'

type PartTimeJobExternalData = {
  employerSSN?: string
  employerName?: string
  periodFrom?: string
  periodTo?: string
  ratio?: number
  estimatedIncome?: number
}

const getPartTimeDefaults = (application: Application) => {
  const jobs =
    getValueViaPath<PartTimeJobExternalData[]>(
      application.externalData,
      'income.data.partTimeJobs',
    ) ?? []

  return jobs.map((job) => ({
    company: {
      nationalId: job.employerSSN ?? '',
      name: job.employerName?.trim() ?? '',
    },
    jobStart: job.periodFrom ?? '',
    jobEnd: job.periodTo ?? '',
    workPercentage: job.ratio != null ? String(job.ratio) : '',
    estimatedIncome:
      job.estimatedIncome != null ? String(job.estimatedIncome) : '',
  }))
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
        buildTitleField({}),
        buildTableRepeaterField({
          id: 'registerPartTime',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          title: () => {
            const month = new Date().toLocaleDateString('is-IS', {
              month: 'long',
            })
            return {
              ...m.application.partTimeRegisteredIncomeTitle,
              values: { month },
            }
          },
          // titleVariant: '',
          defaultValue: getPartTimeDefaults,
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
            },
            jobStart: {
              component: 'date',
              label: m.application.jobStart,
              width: 'half',
              required: true,
              minDate: getCurrentMonthStartDate,
              maxDate: getCurrentMonthEndDate,
            },
            jobEnd: {
              component: 'date',
              label: m.application.jobEnd,
              width: 'half',
              minDate: (_application, activeField) => {
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
            validationId: {
              component: 'hiddenInput',
              defaultValue: () => uuid(),
            },
          },
          table: {
            header: [
              m.application.tableHeaderNationalId,
              m.application.tableHeaderCompany,
              m.application.tableHeaderWorkPercentage,
              m.application.tableHeaderJobStart,
              m.application.tableHeaderEstimatedIncome,
            ],
            rows: [
              'nationalId',
              'company.name',
              'workPercentage',
              'jobStart',
              'estimatedIncome',
            ],
            format: {
              nationalId: (value) => {
                if (!value) return ''
                const clean = value.replace('-', '')
                return `${clean.slice(0, 6)}-${clean.slice(6)}`
              },
              jobStart: formatIsDateLong,
              workPercentage: (value) => {
                if (!value) return ''
                return `${value}%`
              },
              estimatedIncome: formatIsCurrency,
            },
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
        buildCustomField({
          id: 'partTimeValidation',
          doesNotRequireAnswer: true,
          component: 'PartTimeValidation',
        }),
        buildAlertMessageField({
          id: 'partTimeValidationErrorAlert',
          title: (application) =>
            getValueViaPath<string>(
              application.answers,
              'partTimeValidationErrorTitle',
            ) ?? '',
          message: (application) =>
            getValueViaPath<string>(
              application.answers,
              'partTimeValidationErrorMessage',
            ) ?? '',
          alertType: 'error',
          marginTop: 6,
          condition: (answers: FormValue) =>
            !!getValueViaPath<string>(
              answers,
              'partTimeValidationErrorMessage',
            ),
        }),
      ],
    }),
  ],
})
