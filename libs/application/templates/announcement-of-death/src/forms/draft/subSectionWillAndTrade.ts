import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildTextField,
  buildSubSection,
  buildCustomField,
  buildFieldOptions,
  buildRadioField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionWillAndTrade = buildSubSection({
  id: 'inheritanceStep',
  title: 'Erfðaskrá og kaupmáli',
  children: [
    buildMultiField({
      id: 'inheritanceTitle',
      title: 'Erfðaskrá og kaupmáli',
      description:
        'Upplýsingar um erfðaskrá og kaupmála eru sóttar til Sýslumanns. Ef fleiri en ein erfðaskrá er til staðar er mikilvægt að koma frumriti eða upplýsingum um þær til sýslumanns eins fljótt og kostur er. ',
      space: 1,
      children: [
        buildKeyValueField({
          label: 'Erfðaskrá í vörslu sýslumanns',
          value: 'Já',
          width: 'half',
        }),
        buildKeyValueField({
          label: 'Kaupmáli',
          value: 'Nei',
          width: 'half',
        }),
        buildRadioField({
          id: 'knowledgeOfOtherWills',
          title: 'Vitneskja um aðra erfðaskrá',
          width: 'half',
          largeButtons: true,
          options: [
            { value: 'yes', label: 'Já' },
            { value: 'no', label: 'Nei' },
          ],
        }),
      ],
    }),
  ],
})
