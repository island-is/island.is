import {
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurExternalDomainModelsIncomeIrregularJobDTO } from '@island.is/clients/vmst-unemployment'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { hasCasualWorkOverlap, isCasualWork } from '../../../utils/conditions'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsCurrency, formatIsDateLong } from '../../../utils/formatters'
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import { IncomeValidationRow } from '../../../utils/validateIncomes'

type WorkshiftPeriod = {
  id?: string
  name?: string
  english?: string | null
}

const getCasualWorkDefaults = (application: Application) => {
  const jobs =
    getValueViaPath<GaldurExternalDomainModelsIncomeIrregularJobDTO[]>(
      application.externalData,
      'income.data.irregularJobs',
    ) ?? []

  return jobs.map((job) => ({
    validationId: job.id,
    company: {
      nationalId: job.employerSSN ?? '',
      name: job.employerName?.trim() ?? '',
    },
    dateFrom: job.periodFrom ?? '',
    dateTo: job.periodTo ?? '',
    estimatedIncome:
      job.estimatedIncome != null ? String(job.estimatedIncome) : '',
    workshiftPeriod: job.workShiftPeriodIds?.[0] ?? '',
  }))
}

const casualWorkValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerCasualWork',
  incomeTypeKey: 'irregularJobs',
  persistedPath: 'income.data.irregularJobs',
  callbackId: 'CasualWorkValidation',
  messages: {
    fallbackErrorMessage: 'casualWorkValidationErrorMessage',
  },
  rowToInput: (row: IncomeValidationRow) => {
    const nationalId =
      typeof row.company === 'object' && row.company !== null
        ? (row.company as { nationalId?: string }).nationalId
        : undefined
    return {
      validationId: String(row.validationId ?? ''),
      employerSSN: nationalId ? nationalId.replace(/-/g, '') : undefined,
      periodFrom: String(row.dateFrom ?? ''),
      periodTo: String(row.dateTo ?? '') || undefined,
      estimatedIncome: Number(row.estimatedIncome ?? 0),
      workShiftPeriodIds:
        typeof row.workshiftPeriod === 'string' && row.workshiftPeriod
          ? [row.workshiftPeriod]
          : undefined,
    }
  },
}

export const casualWorkSection = buildSubSection({
  id: 'casualWorkSection',
  title: m.application.casualWorkHeading,
  condition: isCasualWork,
  children: [
    buildMultiField({
      id: 'casualWorkMultiField',
      title: m.application.casualWorkHeading,
      description: m.application.casualWorkDescription,
      children: [
        buildTableRepeaterField({
          id: 'registerCasualWork',
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
          defaultValue: getCasualWorkDefaults,
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
            },
            dateFrom: {
              component: 'date',
              label: m.application.dateFrom,
              width: 'half',
              required: true,
              clearOnChange: (index: number) => [
                `registerCasualWork[${index}].dateTo`,
              ],
              minDate: getCurrentMonthStartDate,
              maxDate: getCurrentMonthEndDate,
            },
            dateTo: {
              component: 'date',
              label: m.application.dateTo,
              width: 'half',
              required: true,

              minDate: (_application, activeField) => {
                const fromDate = activeField?.dateFrom
                if (fromDate) {
                  return new Date(fromDate)
                }
                return getCurrentMonthStartDate()
              },
            },
            workshiftPeriod: {
              component: 'select',
              label: m.application.workshiftPeriod,
              width: 'half',
              required: true,
              options: (application, _, locale) => {
                const workshiftPeriods =
                  getValueViaPath<Array<WorkshiftPeriod>>(
                    application.externalData,
                    'workshiftPeriods.data',
                  ) ?? []

                return workshiftPeriods.map((period) => ({
                  label:
                    locale === 'en'
                      ? period.english || period.name || ''
                      : period.name || '',
                  value: period.id ?? '',
                }))
              },
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
            // Reuses an existing id (persisted or previously minted) so this
            // function stays idempotent across renders.
            validationId: {
              component: 'hiddenInput',
              defaultValue: (
                _application: Application,
                activeField?: Record<string, string>,
              ) => activeField?.validationId ?? uuid(),
            },
          },
          table: {
            header: [
              m.application.tableHeaderNationalId,
              m.application.tableHeaderCompany,
              m.application.tableHeaderDateFrom,
              m.application.tableHeaderDateTo,
              m.application.tableHeaderWorkshiftPeriod,
              m.application.tableHeaderEstimatedIncome,
            ],
            rows: [
              'nationalId',
              'company.name',
              'dateFrom',
              'dateTo',
              'workshiftPeriod',
              'estimatedIncome',
            ],
            format: {
              nationalId: (value) => {
                if (!value) return ''
                const clean = value.replace('-', '')
                return `${clean.slice(0, 6)}-${clean.slice(6)}`
              },
              dateFrom: formatIsDateLong,
              dateTo: formatIsDateLong,
              workshiftPeriod: (value, _displayIndex, application) => {
                if (!value || !application) return ''
                const workshiftPeriods =
                  getValueViaPath<Array<WorkshiftPeriod>>(
                    application.externalData,
                    'workshiftPeriods.data',
                  ) ?? []
                const period = workshiftPeriods.find((p) => p.id === value)
                return period?.name ?? value
              },
              estimatedIncome: formatIsCurrency,
            },
          },
        }),
        buildAlertMessageField({
          id: 'casualWorkOverlapAlert',
          title: m.errorMessages.casualWorkOverlappingPeriods,
          message: m.errorMessages.casualWorkOverlappingPeriodsAlertMessage,
          alertType: 'warning',
          marginTop: 6,
          condition: hasCasualWorkOverlap,
        }),
        buildCustomField(
          {
            id: 'casualWorkValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          casualWorkValidationProps,
        ),
      ],
    }),
  ],
})
