import {
  buildCustomField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import {
  CEMETRY,
  CEMETRYEQUITIESANDLIABILITIESIDS,
  CEMETRYOPERATIONIDS
} from '../../../lib/constants'
import { m } from '../../../lib/messages'

export const cemetryKeyNumbersSection = buildSection({
  id: 'cemetryKeyNumbers',
  title: m.keyNumbers,
  condition: (_answers, externalData) => {
    /* @ts-ignore */
    const userType = externalData?.currentUserType?.data?.code
    return userType === CEMETRY
  },
  children: [
    buildSubSection({
      id: 'operatingCost',
      title: m.expensesIncome,
      children: [
        buildCustomField({
          id: 'cemetryIncome',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          component: 'CemetryOperation',
          childInputIds: Object.values(CEMETRYOPERATIONIDS),
        }),
      ],
    }),
    buildSubSection({
      id: 'keyNumbers.cemetryEquitiesAndLiabilities',
      title: m.keyNumbersProperty,
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
})
