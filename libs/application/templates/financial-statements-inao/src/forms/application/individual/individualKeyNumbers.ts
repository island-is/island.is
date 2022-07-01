import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  CEMETRY,
  EQUITIESANDLIABILITIESIDS,
  INDIVIDUAL,
  GREATER,
  INDIVIDUALOPERATIONIDS,
  LESS,
  PARTYOPERATIONIDS,
  PARTY,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const individualKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const greaterThanLimit = getValueViaPath(answers, 'election.incomeLimit') === GREATER
    const userType = externalData?.currentUserType?.data?.code
    return greaterThanLimit && userType === INDIVIDUAL
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'IndividualIncome',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          component: 'IndividualElectionOperatingIncome',
          childInputIds: Object.values(INDIVIDUALOPERATIONIDS),
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
          component: 'ElectionEquities',
          childInputIds: Object.values(EQUITIESANDLIABILITIESIDS),
        }),
      ],
    }),
  ],
})
