import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { RateCategory } from '../../utils/constants'
import { m } from '../../lib/messages'

export const categorySelection = buildSection({
  id: 'categorySelectionSection',
  title: m.categorySelection.sectionTitle,
  children: [
    buildMultiField({
      id: 'categorySelectionMultiField',
      title: m.categorySelection.multiTitle,
      children: [
        buildDescriptionField({
          id: 'categorySelectionDescription',
          description: m.categorySelection.description,
        }),
        buildRadioField({
          id: 'categorySelectionRadio',
          required: true,
          options: [
            {
              label: m.categorySelection.optionDayRate,
              value: RateCategory.DAYRATE,
            },
            {
              label: m.categorySelection.optionKmRate,
              value: RateCategory.KMRATE,
            },
          ],
        }),
      ],
    }),
  ],
})
