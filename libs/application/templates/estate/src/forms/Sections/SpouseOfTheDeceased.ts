import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import { JA, YES, NEI, NO } from '../../lib/constants'
import { deceasedInfoFields } from './deceasedInfoFields'

export const deceasedSpouse = buildSection({
  id: 'deceasedSpouse',
  title: 'Hinn látni',
  children: [
    buildMultiField({
      id: 'deceased',
      title: 'Hinn látni',
      description: 'Trolo',
      children: [
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'space',
          space: 'containerGutter',
          title: '',
        }),
        buildRadioField({
          id: 'deceasedWithUndividedEstate.selection',
          title: 'Sat hinn látni í óskiptu búi?',
          width: 'half',
          largeButtons: false,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
        buildDescriptionField({
          id: 'deceasedSpouse',
          space: 'containerGutter',
          title: 'Maki hins látna',
          titleVariant: 'h4',
          marginBottom: 2,
          condition: (answers) =>
            getValueViaPath(
              answers,
              'deceasedWithUndividedEstate.selection',
            ) === YES,
        }),
        buildCustomField({
          id: 'deceasedWithUndividedEstate.spouse',
          title: '',
          component: 'LookupPerson',
          condition: (answers) =>
            getValueViaPath(
              answers,
              'deceasedWithUndividedEstate.selection',
            ) === YES,
        }),
      ],
    }),
  ],
})
