import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  CEMETRY,
  EQUITIESANDLIABILITIESIDS,
  LESS,
  PARTYOPERATIONIDS,
  PARTY,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { capitalNumberSection } from '../shared/keyNumbers/capitalNumbers'

export const partyKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (_answers, externalData) => {
    /* @ts-ignore */
    const userType = externalData?.currentUserType?.data?.code
    return userType === PARTY
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'partyOperations',
          title: m.keyNumbersIncomeAndExpenses,
          condition: (_answers, externalData) => {
            /* @ts-ignore */
            const userType = externalData?.currentUserType?.data?.code
            return userType === PARTY
          },
          description: m.fillOutAppopriate,
          component: 'PartyOperatingIncome',
          childInputIds: Object.values(PARTYOPERATIONIDS),
        }),
      ],
    }),
    capitalNumberSection,
    buildSubSection({
      id: 'keyNumbers.equitiesAndLiabilities',
      title: m.keyNumbersProperty,
      children: [
        buildCustomField({
          id: 'equitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          component: 'ElectionEquities',
          childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
