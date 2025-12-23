import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
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
        buildTableRepeaterField({
          id: 'participantList',
          table: {
            rows: ['name', 'nationalId', 'email', 'phone'],
            header: [
              m.participant.participantName,
              m.participant.participantNationalId,
              m.participant.participantEmail,
              m.participant.participantPhone,
            ],
          },
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: m.participant.participantNationalId,
              searchPersons: true,
              required: true,
              showEmailField: true,
              showPhoneField: true,
              phoneRequired: true,
              emailRequired: true,
            },
          },
        }),
      ],
    }),
  ],
})
