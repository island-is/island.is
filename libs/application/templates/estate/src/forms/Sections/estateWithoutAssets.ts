import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { JA, YES, NEI, NO, EstateTypes } from '../../lib/constants'

export const estateWithoutAssets = buildSection({
  id: 'estateAssetsExist',
  title: 'Eru eignir og/eða skuldir til staðar?',
  children: [
    buildMultiField({
      id: 'estateAssetsExist',
      title: 'Eru eignir og/eða skuldir til staðar?',
      description: 'Eru eignir til staðar?',
      children: [
        buildRadioField({
          id: 'estateWithoutAssets.estateAssetsExist',
          title: 'Eru eignir til staðar?',
          width: 'half',
          largeButtons: false,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
        buildRadioField({
          id: 'estateWithoutAssets.estateDebtsExist',
          title: 'Eru skuldir til staðar?',
          width: 'half',
          largeButtons: false,
          space: 'containerGutter',
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
          condition: (answers) =>
            getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES,
        }),
        buildDescriptionField({
          id: 'space',
          title: '',
          space: 'containerGutter',
        }),
        buildDescriptionField({
          id: 'helper',
          title: '',
          condition: (answers) =>
            getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES,
        }),
      ],
    }),
  ],
})
