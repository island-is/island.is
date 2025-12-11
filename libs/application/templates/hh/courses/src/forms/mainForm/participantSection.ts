import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const participantSection = buildSection({
  id: 'participantSection',
  title: m.participant.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantSectionMultiField',
      title: m.participant.sectionTitle,
      children: [
        buildNationalIdWithNameField({
          id: 'participantNationalIdAndName',
          required: true,
          showEmailField: true,
          emailRequired: true,
          showPhoneField: true,
          phoneRequired: true,
        }),
      ],
    }),
  ],
})
