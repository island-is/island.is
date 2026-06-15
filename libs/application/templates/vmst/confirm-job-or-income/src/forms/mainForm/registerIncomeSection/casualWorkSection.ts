import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isCasualWork } from '../../../utils/conditions'

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
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
            },
            monthFrom: {
              component: 'date',
              label: m.application.monthFrom,
              width: 'half',
              required: true,
              clearOnChange: (index: number) => [
                `registerCasualWork[${index}].monthTo`,
              ],
              minDate: () => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
              },
            },
            monthTo: {
              component: 'date',
              label: m.application.monthTo,
              width: 'half',
              required: true,
              minDate: (_application, activeField) => {
                const fromDate = activeField?.monthFrom
                if (fromDate) {
                  return new Date(fromDate)
                }
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
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
              m.application.tableHeaderMonthFrom,
              m.application.tableHeaderMonthTo,
              m.application.tableHeaderEstimatedIncome,
            ],
            rows: [
              'nationalId',
              'company',
              'monthFrom',
              'monthTo',
              'estimatedIncome',
            ],
            format: {
              nationalId: (value) => {
                if (!value) return ''
                const clean = value.replace('-', '')
                return `${clean.slice(0, 6)}-${clean.slice(6)}`
              },
              monthFrom: (value) => {
                if (!value) return ''
                const date = new Date(value)
                if (isNaN(date.getTime())) return value
                return date.toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              },
              monthTo: (value) => {
                if (!value) return ''
                const date = new Date(value)
                if (isNaN(date.getTime())) return value
                return date.toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              },
              estimatedIncome: (value) => {
                if (!value) return ''
                const num = Number(value)
                return `${num.toLocaleString('is-IS')} kr.`
              },
            },
          },
        }),
      ],
    }),
  ],
})
