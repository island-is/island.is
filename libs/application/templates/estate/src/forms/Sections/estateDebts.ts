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

    return getValueViaPath(answers, 'selectedEstate') ===
    EstateTypes.estateWithoutAssets
      ? getValueViaPath(answers, 'estateWithoutAssets.estateDebtsExist') === YES
      : true},
  children: [
    buildMultiField({
      id: 'debts',
      title: m.debtsTitle,
      description: (application) =>
        application.answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.debtsDescriptionEstateWithoutAssets
          : application.answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.debtsDescriptionOfficialDivision
          : application.answers.selectedEstate ===
            EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.debtsDescriptionUndividedEstate
          : /* EINKASKIPTI */
            m.debtsDescriptionDivisionOfEstateByHeirs,
      children: [
        buildCustomField(
          {
            title: '',
            id: 'debts',
            component: 'TextFieldsRepeater',
          },
          {
            fields: [
              {
                title: m.debtsCreditorName.defaultMessage,
                id: 'creditorName',
              },
              {
                title: m.debtsNationalId.defaultMessage,
                id: 'nationalId',
                format: '######-####',
              },
              {
                title: m.debtsLoanIdentity.defaultMessage,
                id: 'loanIdentity',
              },
              {
                title: m.debtsBalance.defaultMessage,
                id: 'balance',
                currency: true,
              },
            ],
            repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
            repeaterHeaderText: m.debtsCreditorHeader.defaultMessage,
          },
        ),
      ],
    }),
  ],
})
