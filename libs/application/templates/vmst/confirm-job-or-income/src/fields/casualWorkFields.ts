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
      const items =
        getValueViaPath<unknown[]>(application.answers, 'registerIncome') ?? []
      return items.length > 1 ? `Tilfallandi vinna ${index + 1}` : ''
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
      },
      monthTo: {
        component: 'date',
        label: m.application.monthTo,
        width: 'half',
        required: true,
      },
      estimatedIncome: {
        component: 'input',
        label: m.application.estimatedMonthlyIncome,
        width: 'half',
        type: 'number',
        currency: true,
        required: true,
      },
    },
  }),
]
