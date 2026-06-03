import {
  buildDescriptionField,
  buildAlertMessageField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { isContractWork } from '../utils/conditions'

export const contractWorkFields = [
  buildDescriptionField({
    id: 'contractWorkDesc',
    description: m.application.contractWorkDescription,
    condition: isContractWork,
  }),
  buildAlertMessageField({
    id: 'contractWorkAlert',
    title: m.application.contractWorkAlertTitle,
    message: m.application.contractWorkAlert,
    alertType: 'info',
    condition: isContractWork,
  }),
  buildFieldsRepeaterField({
    id: 'registerIncome',
    condition: isContractWork,
    formTitleNumbering: 'none',
    formTitle: (index, application) => {
      const items =
        getValueViaPath<unknown[]>(application.answers, 'registerIncome') ?? []
      return items.length > 1 ? `Vaktavinna ${index + 1}` : ''
    },
    addItemButtonText: m.application.addLine,
    minRows: 1,
    fields: {
      contractJobStart: {
        component: 'date',
        label: m.application.jobStart,
        width: 'half',
        required: true,
      },
      workEnds: {
        component: 'date',
        label: m.application.workEnds,
        width: 'half',
        required: true,
      },
    },
  }),
]
