import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { RateCategory } from '../../utils/constants'

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
          required: true,
          options: [
            {
              label: 'Færa bifreiðar á daggjald',
              value: RateCategory.DAYRATE,
            },
            {
              label: 'Færa bifreiðar á kílómetragjald',
              value: RateCategory.KMRATE,
            },
          ],
        }),
      ],
    }),
  ],
})
