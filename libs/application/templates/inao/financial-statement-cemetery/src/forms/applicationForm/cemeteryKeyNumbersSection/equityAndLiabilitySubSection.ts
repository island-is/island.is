import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { CEMETERYEQUITIESANDLIABILITIESIDS } from '../../../utils/constants'

export const equityAndLiabilitiesSubSection = buildSubSection({
  id: 'keyNumbers.cemetryEquitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildMultiField({
      id: 'cemetryEquitiesAndLiabilities',
      title: m.keyNumbersDebt,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'cemeteryEquitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          component: 'CemeteryEquities',
          childInputIds: Object.values(CEMETERYEQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
