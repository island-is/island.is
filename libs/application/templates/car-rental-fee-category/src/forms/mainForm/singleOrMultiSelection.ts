import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { UploadSelection } from '../../utils/constants'
import { m } from '../../lib/messages'

export const singleOrMultiSelection = buildSection({
  id: 'singleOrMultiSelectionSection',
  title: m.singleOrMulti.sectionTitle,
  children: [
    buildMultiField({
      id: 'singleOrMultiSelectionMultiField',
      title: m.singleOrMulti.multiTitle,
      children: [
        buildDescriptionField({
          id: 'singleOrMultiSelectionDescription',
          description: m.singleOrMulti.description,
        }),

        buildRadioField({
          id: 'singleOrMultiSelectionRadio',
          required: true,
          options: [
            {
              label: m.singleOrMulti.optionMultiLabel,
              subLabel: m.singleOrMulti.optionMultiSubLabel,
              value: UploadSelection.MULTI,
            },
            {
              label: m.singleOrMulti.optionSingleLabel,
              subLabel: m.singleOrMulti.optionSingleSubLabel,
              value: UploadSelection.SINGLE,
              disabled: true,
            },
          ],
        }),
      ],
    }),
  ],
})
