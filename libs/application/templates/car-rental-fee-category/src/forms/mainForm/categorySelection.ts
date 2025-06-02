import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { CategorySelection } from '../../utils/constants'

export const categorySelection = buildSection({
  id: 'categorySelectionSection',
  title: 'Gjald tegund',
  children: [
    buildMultiField({
      id: 'categorySelectionMultiField',
      title: 'Skrá bifreiðar á kílómetragjald eða daggjald',
      children: [
        buildDescriptionField({
          id: 'categorySelectionDescription',
          description: 'Veldur þær breytingar sem þú vilt gera',
        }),
        buildRadioField({
          id: 'categorySelectionRadio',
          options: [
            {
              label: 'Færa bifreiðar á daggjald',
              value: CategorySelection.DAYRATE,
            },
            {
              label: 'Færa bifreiðar á kílómetragjald',
              value: CategorySelection.KMRATE,
            },
          ],
        }),
      ],
    }),
  ],
})
