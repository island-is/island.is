import {
  buildSection,
  buildMultiField,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateTypes, YES } from '../../lib/constants'

export const estateDebts = buildSection({
  id: 'debts',
  title: m.debtsTitle,
  condition: (answers) => {
    const assetsExists = getValueViaPath(
      answers,
      'estateWithoutAssets.estateAssetsExist',
    )
    const debtExists = getValueViaPath(
      answers,
      'estateWithoutAssets.estateDebtsExist',
    )
    const selectedEstate = getValueViaPath(answers, 'selectedEstate')

    return selectedEstate === EstateTypes.estateWithoutAssets
      ? assetsExists === YES && debtExists === YES
      : true
  },
  children: [
    buildMultiField({
      id: 'debts',
      title: m.debtsTitle,
      description: ({ answers }) =>
        answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.debtsDescriptionEstateWithoutAssets
          : answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.debtsDescriptionOfficialDivision
          : answers.selectedEstate === EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.debtsDescriptionUndividedEstate
          : /* EINKASKIPTI */
            m.debtsDescriptionDivisionOfEstateByHeirs,
      children: [
        buildCustomField(
          {
            id: 'debts',
            component: 'TextFieldsRepeater',
          },
          {
            fields: [
              {
                title: m.debtsCreditorName,
                id: 'creditorName',
              },
              {
                title: m.debtsNationalId,
                id: 'nationalId',
                format: '######-####',
              },
              {
                title: m.debtsLoanIdentity,
                id: 'loanIdentity',
              },
              {
                title: m.debtsBalance,
                id: 'balance',
                currency: true,
              },
            ],
            repeaterButtonText: m.debtsRepeaterButton,
            repeaterHeaderText: m.debtsCreditorHeader,
          },
        ),
      ],
    }),
  ],
})
