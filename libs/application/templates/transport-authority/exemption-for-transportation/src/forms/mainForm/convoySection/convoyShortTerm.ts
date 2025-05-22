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
      id: 'convoy.items[0].vehicle.permno',
      title: convoy.labels.vehiclePermno,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      maxLength: 5,
      setOnChange: async (value) => {
        console.log('setOnChange')
        console.log('value', value)
        return []
      },
    }),
    buildTextField({
      id: 'convoy.items[0].vehicle.makeAndColor',
      title: convoy.labels.vehicleMakeAndColor,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
    }),
    buildTextField({
      id: 'convoy.items[0].trailer.permno',
      title: convoy.labels.trailerPermno,
      backgroundColor: 'blue',
      width: 'half',
      maxLength: 5,
    }),
    buildTextField({
      id: 'convoy.items[0].trailer.makeAndColor',
      title: convoy.labels.trailerMakeAndColor,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
    }),
  ],
})
