import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { EQUITIESANDLIABILITIESIDS } from '../../../lib/utils/constants'
import { m } from '../../../lib/utils/messages'

export const equityAndLiabilitiesSubSection = buildSubSection({
  id: 'keyNumbers.equitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildMultiField({
      id: 'operations.equitiesAndLiabilities',
      title: m.keyNumbersDebt,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'equitiesAndLiabilities',
          title: m.keyNumbersDebt,
          component: 'ElectionEquities',
          childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
