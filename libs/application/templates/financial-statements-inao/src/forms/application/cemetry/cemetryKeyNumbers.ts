import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  CEMETRY,
  CEMETRYEQUITIESANDLIABILITIESIDS,
  CEMETRYOPERATIONIDS,
  CAPITALNUMBERS,
} from '../../../lib/constants'
import { capitalNumberSection } from '../shared/keyNumbers/capitalNumbers'
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
        buildMultiField({
          id: 'cemetryEquitiesAndLiabilities',
          title: m.keyNumbersIncomeAndExpenses,
          description: m.fillOutAppopriate,
          children: [
            buildCustomField({
              id: 'cemetryIncome',
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
