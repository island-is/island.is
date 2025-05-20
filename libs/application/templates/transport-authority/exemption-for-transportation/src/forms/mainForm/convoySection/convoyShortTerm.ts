import { buildMultiField, buildTextField } from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeShortTerm } from '../../../utils'

export const ConvoyShortTermMultiField = buildMultiField({
  id: 'convoyShortTermMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    buildTextField({
      id: 'convoy.items[0].vehiclePermno',
      title: convoy.labels.vehicle,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      maxLength: 5,
    }),
    buildTextField({
      id: 'convoy.items[0].trailerPermno',
      title: convoy.labels.trailer,
      backgroundColor: 'blue',
      width: 'half',
      maxLength: 5,
    }),
  ],
})
