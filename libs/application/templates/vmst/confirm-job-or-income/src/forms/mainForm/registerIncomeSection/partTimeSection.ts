import {
  buildAlertMessageField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isPartTime } from '../../../utils/conditions'

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
          title: m.application.partTimeAlertTitle,
          message: m.application.partTimeAlert,
          alertType: 'info',
        }),
        buildTableRepeaterField({
          id: 'registerPartTime',
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
            jobStart: {
              component: 'date',
              label: m.application.jobStart,
              width: 'half',
              required: true,
              minDate: () => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
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
          },
          table: {
            header: [
              m.application.tableHeaderCompany,
              m.application.tableHeaderJobStart,
              m.application.tableHeaderWorkPercentage,
              m.application.tableHeaderEstimatedIncome,
            ],
            rows: [
              'nationalId',
              'company',
              'jobStart',
              'workPercentage',
              'estimatedIncome',
            ],
            format: {
              nationalId: (value) => {
                if (!value) return ''
                const clean = value.replace('-', '')
                return `${clean.slice(0, 6)}-${clean.slice(6)}`
              },
              jobStart: (value) => {
                if (!value) return ''
                const date = new Date(value)
                if (isNaN(date.getTime())) return value
                return date.toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              },
              workPercentage: (value) => {
                if (!value) return ''
                return `${value}%`
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
