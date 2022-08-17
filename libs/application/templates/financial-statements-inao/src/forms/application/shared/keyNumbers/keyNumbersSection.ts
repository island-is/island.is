import {
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { GREATER } from '../../../../lib/constants'
import { m } from '../../../../lib/messages'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers) => {
    return getValueViaPath(answers, 'electionInfo.incomeLimit') === GREATER
  },
  children: [
    buildSubSection({
      id: 'keynumbers.incomeAndExpenses',
      title: m.expenses,
      children: [
        buildMultiField({
          id: 'incomeAndExpenses',
          title: m.keyNumbersExpenses,
          description: m.fillOutAppopriate,
          children: [
            buildTextField({
              id: 'incomeAndExpenses.donations',
              title: m.donations,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'incomeAndExpenses.personal',
              title: m.personalIncome,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'incomeAndExpenses.capitalIncome',
              title: m.capitalIncome,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'incomeAndExpenses.partyRunning',
              title: m.keyNumbersParty,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'incomeAndExpenses.capital',
              title: m.financeCost,
              variant: 'currency',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'keyNumbers.propertiesAndDebts',
      title: m.properties,
      children: [
        buildMultiField({
          id: 'propertiesAndDebts',
          title: m.keyNumbersProperty,
          description: m.fillOutAppopriate,
          children: [
            buildTextField({
              id: 'propertiesAndDebts.propertiesShort',
              title: m.propertiesShort,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'propertiesAndDebts.propertiesCash',
              title: m.propertiesCash,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'propertiesAndDebts.debtsShort',
              title: m.debtsShort,
              variant: 'currency',
              width: 'half',
            }),
            buildTextField({
              id: 'propertiesAndDebts.longTermDebt',
              title: m.debtsLong,
              variant: 'currency',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
  ],
})
