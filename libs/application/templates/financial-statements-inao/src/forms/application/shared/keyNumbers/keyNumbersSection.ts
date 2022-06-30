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
  OPERATIONIDS,
  PARTYOPERATIONIDS,
  PARTY,
} from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers) => {
    // return getValueViaPath(answers, 'election.incomeLimit') !== LESS
    return false
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      condition: (_answers, externalData) => {
        // check type
        return false
      },
      children: [
        buildCustomField({
          id: 'income',
          title: m.keyNumbersIncomeAndExpenses,
          condition: (_answers, externalData) => {
            // check type
            return false
          },
          description: m.fillOutAppopriate,
          component: 'IndividualElectionOperatingIncome',
          childInputIds: Object.values(OPERATIONIDS),
        }),
        buildCustomField({
          id: 'partyIncome',
          title: m.keyNumbersIncomeAndExpenses,
          condition: (_answers, externalData) => {
            const userType = externalData?.currentUserType?.data?.code
            return userType === PARTY
          },
          description: m.fillOutAppopriate,
          component: 'PartyOperatingIncome',
          childInputIds: Object.values(PARTYOPERATIONIDS),
        }),
        buildCustomField({
          id: 'cemetryIncome',
          title: m.keyNumbersIncomeAndExpenses,
          condition: (_answers, externalData) => {
            const userType = externalData?.currentUserType?.data?.code
            return userType === CEMETRY
          },
          description: m.fillOutAppopriate,
          component: 'CemetryOperation',
          childInputIds: Object.values(PARTYOPERATIONIDS),
        }),
      ],
    }),
    buildSubSection({
      id: 'keyNumbers.equitiesAndLiabilities',
      title: m.keyNumbersProperty,
      children: [
        buildCustomField({
          id: 'equitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          component: 'IndividualElectionEquities',
          childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
