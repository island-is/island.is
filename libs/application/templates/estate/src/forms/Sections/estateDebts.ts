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
            id: 'debts.data',
            component: 'DebtsRepeater',
          },
          {
            fields: [
              {
                title: m.debtsCreditorType,
                id: 'debtType',
                placeholder: m.debtsCreditorType,
              },
              {
                title: m.debtsNationalId,
                id: 'nationalId',
                format: '######-####',
                required: false,
              },
              {
                title: m.debtsCreditorName,
                id: 'creditorName',
                required: true,
              },
              {
                title: m.debtsLoanIdentity,
                id: 'loanIdentity',
                required: false,
              },
              {
                title: m.debtsBalance,
                id: 'balance',
                currency: true,
                required: true,
              },
            ],
            repeaterButtonText: m.debtsRepeaterButton,
            sumField: 'balance',
            fromExternalData: 'otherDebts',
            selections: [
              { value: 'Duties', label: m.debtsTypeDuties },
              { value: 'OtherDebts', label: m.debtsTypeOther },
              { value: 'PropertyFees', label: m.debtsTypePropertyFees },
              { value: 'InsuranceCompany', label: m.debtsTypeInsurance },
              { value: 'Loan', label: m.debtsTypeLoan },
              { value: 'CreditCard', label: m.debtsTypeCreditCard },
              { value: 'Overdraft', label: m.debtsTypeOverdraft },
            ],
          },
        ),
      ],
    }),
  ],
})
