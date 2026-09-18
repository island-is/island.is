import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { hasCasualWorkOverlap, isCasualWork } from '../../../utils/conditions'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsCurrency, formatIsDateLong } from '../../../utils/formatters'

type WorkshiftPeriod = {
  id?: string
  name?: string
  english?: string | null
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
          initActiveFieldIfEmpty: true,
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
      ],
    }),
  ],
})
