import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const mainSection = buildSection({
  id: 'mainSection',
  title: m.mainSectionTitle,
  children: [
    buildMultiField({
      id: 'mainSection',
      title: m.mainSectionTitle,
      children: [
        buildNationalIdWithNameField({
          id: 'participantNationalIdAndName',
          title: m.mainSectionParticipantHeading,
          required: true,
          showEmailField: true,
          emailRequired: true,
          showPhoneField: true,
          phoneRequired: true,
        }),
        buildTitleField({
          title: m.mainSectionPayerHeading,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'payerNationalId',
          title: m.mainSectionPayerNationalId,
          width: 'half',
          format: '######-####',
          required: true,
        }),
        buildTextField({
          id: 'payerName',
          title: m.mainSectionPayerName,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
