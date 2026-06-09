import {
  buildDescriptionField,
  buildAlertMessageField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { isPartTime } from '../utils/conditions'

export const partTimeFields = [
  buildDescriptionField({
    id: 'partTimeDesc',
    description: m.application.partTimeDescription,
    condition: isPartTime,
  }),
  buildAlertMessageField({
    id: 'partTimeAlert',
    title: m.application.partTimeAlertTitle,
    message: m.application.partTimeAlert,
    alertType: 'info',
    condition: isPartTime,
  }),
  buildFieldsRepeaterField({
    id: 'registerIncome',
    condition: isPartTime,
    formTitleNumbering: 'suffix',
    formTitle: (_index, application) => {
      const items = getValueViaPath<Array<unknown>>(
        application.answers,
        'registerIncome',
      )
      if (!items || items.length <= 1) {
        return ''
      }
      return m.application.partTimeHeading
    },
    addItemButtonText: m.application.addLine,
    minRows: 1,
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
  }),
]
