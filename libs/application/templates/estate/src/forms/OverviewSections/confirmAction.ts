import {
  buildCheckboxField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateTypes, YES } from '../../lib/constants'

export const overviewConfirmAction = [
  buildCheckboxField({
    id: 'confirmAction',
    backgroundColor: 'blue',
    defaultValue: [],
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets,
    options: (application) => {
      const hasAssets =
        getValueViaPath(
          application.answers,
          'estateWithoutAssets.estateAssetsExist',
        ) === YES
      const hasDebt =
        getValueViaPath(
          application.answers,
          'estateWithoutAssets.estateDebtsExist',
        ) === YES

      if ((hasAssets && hasDebt) || (hasAssets && !hasDebt)) {
        return [
          {
            value: YES,
            label: m.acceptAssets,
          },
        ]
      } else if (!hasAssets && !hasDebt) {
        return [
          {
            value: YES,
            label: m.acceptNoAssetsNoDebts,
          },
        ]
      } else return []
    },
  }),
  buildCheckboxField({
    id: 'confirmActionAssetsAndDebt',
    backgroundColor: 'blue',
    defaultValue: [],
    condition: (answers) => {
      const hasAssets =
        getValueViaPath(answers, 'estateWithoutAssets.estateAssetsExist') ===
        YES
      const hasDebt =
        getValueViaPath(answers, 'estateWithoutAssets.estateDebtsExist') === YES

      const estateWithoutAssetsSelected =
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets

      return estateWithoutAssetsSelected && hasDebt && hasAssets
    },

    options: () => {
      return [
        {
          value: YES,
          label: m.acceptNoAssets,
        },
      ]
    },
  }),
  buildCheckboxField({
    id: 'confirmActionUndividedEstate',
    backgroundColor: 'blue',
    defaultValue: [],
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
    options: () => [
      {
        value: YES,
        label: m.acceptCorrectAssets,
      },
    ],
  }),
]
