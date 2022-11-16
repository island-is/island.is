import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  EQUITIESANDLIABILITIESIDS,
  GREATER,
  INDIVIDUALOPERATIONIDS,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { getCurrentUserType } from '../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../types'
import { capitalNumberSection } from '../shared/keyNumbers/capitalNumbers'

export const individualKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const greaterThanLimit =
      getValueViaPath(answers, 'election.incomeLimit') === GREATER
    const isIndividual =
      getCurrentUserType(answers, externalData) === FSIUSERTYPE.INDIVIDUAL

    return greaterThanLimit && isIndividual
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.keyNumbersIncomeAndExpenses,
      children: [
        buildMultiField({
          id: 'operatinCostfields',
          title: m.expensesIncome,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'IndividualIncome',
              title: '',
              component: 'IndividualElectionOperatingIncome',
              childInputIds: Object.values(INDIVIDUALOPERATIONIDS),
            }),
          ],
        }),
      ],
    }),
    capitalNumberSection,
    buildSubSection({
      id: 'keyNumbers.equitiesAndLiabilities',
      title: m.keyNumbersDebt,
      children: [
        buildMultiField({
          id: 'operations.equitiesAndLiabilities',
          title: m.propertiesAndDebts,
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
    }),
  ],
})
