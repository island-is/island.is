import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import {
  CEMETRYEQUITIESANDLIABILITIESIDS,
  CEMETRYOPERATIONIDS,
} from '../../../lib/constants'
import { capitalNumberSection } from '../shared/keyNumbers/capitalNumbers'
import { m } from '../../../lib/messages'
import { getCurrentUserType } from '../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../types'

export const cemetryKeyNumbersSection = buildSection({
  id: 'cemetryKeyNumbers',
  title: m.keyNumbers,
  condition: (answers, externalData) => {
    const userType = getCurrentUserType(answers, externalData)
    return userType === FSIUSERTYPE.CEMETRY
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildMultiField({
          id: 'cemetryIncomeAndExpense',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'cemetryKeyNumbers',
              title: '',
              component: 'CemetryOperation',
              childInputIds: Object.values(CEMETRYOPERATIONIDS),
            }),
          ],
        }),
      ],
    }),
    capitalNumberSection,
    buildSubSection({
      id: 'keyNumbers.cemetryEquitiesAndLiabilities',
      title: m.propertiesAndDebts,
      children: [
        buildMultiField({
          id: 'cemetryEquitiesAndLiabilities',
          title: m.keyNumbersDebt,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'cemetryEquitiesAndLiabilities',
              title: m.keyNumbersDebt,
              description: m.fillOutAppopriate,
              component: 'CemetryEquities',
              childInputIds: Object.values(CEMETRYEQUITIESANDLIABILITIESIDS),
            }),
          ],
        }),
      ],
    }),
  ],
})
