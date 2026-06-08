import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { isCasualWork } from '../utils/conditions'

export const casualWorkFields = [
  buildDescriptionField({
    id: 'casualWorkDesc',
    description: m.application.casualWorkDescription,
    condition: isCasualWork,
  }),
  buildDescriptionField({
    id: 'casualWorkInfo',
    title: m.application.casualWorkInfoTitle,
    titleVariant: 'h5',
    description: m.application.casualWorkInfoBullets,
    condition: isCasualWork,
  }),
  buildFieldsRepeaterField({
    id: 'registerIncome',
    condition: isCasualWork,
    formTitleNumbering: 'none',
    formTitle: (index, application) => {
      const items = getValueViaPath<Array<unknown>>(
        application.answers,
        'registerIncome',
      )
      if (!items || items.length <= 1) {
        return ''
      }
      return {
        ...m.application.casualWorkHeading,
        values: { index: index + 1 },
      }
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
      monthFrom: {
        component: 'date',
        label: m.application.monthFrom,
        width: 'half',
        required: true,
        clearOnChange: (index: number) => [`registerIncome[${index}].monthTo`],
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
  }),
]
