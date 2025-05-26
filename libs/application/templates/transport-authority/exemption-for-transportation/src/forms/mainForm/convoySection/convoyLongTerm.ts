import {
  buildMultiField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeLongTerm, MAX_CNT_CONVOY } from '../../../utils'

export const ConvoyLongTermMultiField = buildMultiField({
  id: 'convoyLongTermMultiField',
  condition: (answers) => {
    return isExemptionTypeLongTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    buildTableRepeaterField({
      id: 'convoy.items',
      addItemButtonText: convoy.labels.addItemButtonText,
      saveItemButtonText: convoy.labels.saveItemButtonText,
      removeButtonTooltipText: convoy.labels.removeItemButtonTooltipText,
      editButtonTooltipText: convoy.labels.editItemButtonTooltipText,
      maxRows: MAX_CNT_CONVOY,
      marginTop: 0,
      editField: true,
      initActiveFieldIfEmpty: true,
      table: {
        header: [
          convoy.labels.convoyNumber,
          convoy.labels.vehiclePermno,
          convoy.labels.trailerPermno,
        ],
      },
      fields: {
        vehicle: {
          component: 'input',
          label: convoy.labels.vehiclePermno,
          width: 'full',
          required: true,
        },
      },
    }),
  ],
})
