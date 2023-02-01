import {
  buildDescriptionField,
  buildMultiField,
  buildTextField,
  buildRadioField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'

import { m } from '../../lib/messages'
import { Passport } from '../../lib/constants'

export const info = buildMultiField({
  id: 'personalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  children: [
    buildTextField({
      id: 'info.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        application.answers.passportName,
    }),
    buildTextField({
      id: 'info.passportNumber',
      title: m.passportNumber,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        application.answers.passportNumber,
    }),
    buildDescriptionField({
      id: 'service.dropTypeDescription',
      title: m.infoText,
      titleVariant: 'h3',
      description: m.infoTextDescription,
      space: 'gutter',
    }),

    buildRadioField({
      id: 'status',
      title: m.statusTitle,
      width: 'full',
      space: 'gutter',
      largeButtons: false,
      options: () => [
        {
          value: 'lost',
          label: m.statusLost,
        },
        {
          value: 'stolen',
          label: m.statusStolen,
        },
      ],
    }),
    buildTextField({
      id: 'otherInfoText',
      title: m.commentTitle,
      variant: 'textarea',
      doesNotRequireAnswer: true,
      placeholder: m.commentPlaceholder,
    }),
  ],
})
