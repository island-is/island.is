import {
  buildCustomField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import {
  EQUITIESANDLIABILITIESIDS,
  PARTYOPERATIONIDS,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { getCurrentUserType } from '../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../types'
import { capitalNumberSection } from '../shared/keyNumbers/capitalNumbers'

export const partyKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const userType = getCurrentUserType(answers, externalData)
    return userType === FSIUSERTYPE.PARTY
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'partyOperations',
          title: m.keyNumbersIncomeAndExpenses,
          condition: (answers, externalData) => {
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.PARTY
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
    }),
  ],
})
