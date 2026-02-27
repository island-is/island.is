import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { RegistrationType } from '../../utils/constants'
import { m } from '../../lib/messages'

export const registrationTypeSection = buildSection({
  id: 'registrationTypeSection',
  title: m.registrationType.sectionTitle,
  children: [
    buildMultiField({
      id: 'registrationTypeMultiField',
      title: m.registrationType.title,
      children: [
        buildDescriptionField({
          id: 'registrationTypeDescription',
          description: m.registrationType.description,
        }),
        buildRadioField({
          id: 'registrationType',
          required: true,
          options: [
            {
              label: m.registrationType.optionExport,
              value: RegistrationType.EXPORT,
            },
            {
              label: m.registrationType.optionImport,
              value: RegistrationType.IMPORT,
            },
          ],
        }),
      ],
    }),
  ],
})
