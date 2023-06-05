import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const StaysAbroadSubSection = buildSubSection({
  id: 'staysAbroad',
  title: information.labels.staysAbroad.subSectionTitle,
  children: [
    buildMultiField({
      id: 'staysAbroadMultiField',
      title: information.labels.staysAbroad.pageTitle,
      children: [
        buildRadioField({
          id: 'staysAbroad.radio',
          title: information.labels.staysAbroad.title,
          description: '',
          options: [
            {
              value: 'YES',
              label: 'Já',
            },
            {
              value: 'NO',
              label: 'Nei',
            },
          ],
        }),
      ],
    }),
  ],
})
