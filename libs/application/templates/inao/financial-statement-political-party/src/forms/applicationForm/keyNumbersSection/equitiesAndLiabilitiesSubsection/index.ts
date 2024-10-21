import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { EQUITIESANDLIABILITIESIDS } from '../../../../../../shared/utils/constants'

export const equitiesAndLiabilitiesSubsection = buildSubSection({
  id: 'keyNumbers.equitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildCustomField({
      id: 'equitiesAndLiabilities',
      title: m.keyNumbersDebt,
      description: m.fillOutAppopriate,
      component: 'ElectionEquities',
      childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
    }),
  ],
})
