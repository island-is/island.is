import { buildMultiField } from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeLongTerm } from '../../../utils'

export const ConvoyLongTermMultiField = buildMultiField({
  id: 'convoyLongTermMultiField',
  condition: (answers) => {
    return isExemptionTypeLongTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    //TODOy
  ],
})
