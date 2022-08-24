import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  CEMETRYOPERATIONIDS,
  LESS,
  INDIVIDUALOPERATIONIDS,
  CAPITALNUMBERS,
  CEMETRY,
} from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const capitalNumberSection = buildSubSection({
  id: 'capitalNumbers',
  title: m.capitalCost,
  children: [
    buildMultiField({
      id: 'capitalNumberFields',
      title: m.capitalCost,
      description: m.fillOutAppopriate,
      children: [
        buildTextField({
          id: CAPITALNUMBERS.capitalIncome,
          title: m.capitalIncome,
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: CAPITALNUMBERS.capitalExpense,
          title: m.capitalExpense,
          condition: (_answers, externalData) => {
            console.log(externalData)
            // @ts-ignore
            // const userType = externalData.currentUserType.data.code
            // return userType !== CEMETRY
            return true
          },
          width: 'half',
          variant: 'currency',
        }),
      ],
    }),
  ],
})
