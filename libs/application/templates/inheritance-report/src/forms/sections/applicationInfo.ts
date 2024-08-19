import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'

import { m } from '../../lib/messages'

export const applicationInfo = buildSection({
  id: 'applicationInfoSection',
  title: m.applicationInfoSectionTitle,
  children: [
    buildMultiField({
      id: 'applicationInfoSection',
      title: m.applicationInfoTitle,
      description: '',
      children: [
        buildDescriptionField({
          id: 'applicationInfoText',
          title: '',
          description: m.applicationInfoText,
          marginBottom: 8,
        }),
        buildCheckboxField({
          id: 'applicationInfoConfirmation',
          title: '',
          options: [
            { value: YES, label: m.applicationInfoConfirmationText },
          ],
        }),
      ]
    }), 
  ],
})
