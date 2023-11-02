import {
  buildCheckboxField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateTypes, NO, YES } from '../../lib/constants'

export const overviewConfirmAction = [
  buildCheckboxField({
    id: 'confirmAction',
    title: '',
    backgroundColor: 'blue',
    defaultValue: [],
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets,
    options: (application) =>
      getValueViaPath(
        application.answers,
        'estateWithoutAssets.estateAssetsExist',
      ) === NO
        ? [
            {
              value: YES,
              label: m.acceptNoAssets.defaultMessage,
            },
          ]
        : [
            {
              value: YES,
              label: m.acceptAssets.defaultMessage,
            },
          ],
  }),
  buildCheckboxField({
    id: 'confirmActionUndividedEstate',
    title: '',
    backgroundColor: 'blue',
    defaultValue: [],
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
    options: () => [
      {
        value: YES,
        label: m.acceptCorrectAssets.defaultMessage,
      },
    ],
  }),
]
