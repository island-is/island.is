import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { JA, YES, NEI, NO } from '../../lib/constants'

export const estateWithoutAssets = buildSection({
  id: 'estateAssetsExist',
  title: m.doAssetsExistSidebarTitle,
  children: [
    buildMultiField({
      id: 'estateAssetsExist',
      title: m.doAssetsExist,
      children: [
        buildRadioField({
          id: 'estateWithoutAssets.estateAssetsExist',
          title: m.doAssetsExistSelect,
          width: 'half',
          largeButtons: true,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
        buildRadioField({
          id: 'estateWithoutAssets.estateDebtsExist',
          title: m.doDebtsExist,
          width: 'half',
          largeButtons: true,
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
          id: 'spaceNoAssets',
          space: 'containerGutter',
        }),
        buildDescriptionField({
          id: 'helper',
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
