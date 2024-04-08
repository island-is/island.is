import {
  buildDescriptionField,
  buildMultiField,
  buildTextField,
  buildRadioField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { PassportStatus } from '../../lib/constants'

export const info = buildMultiField({
  id: 'personalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  children: [
    buildTextField({
      id: 'passportName',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        application.answers.passportName,
    }),
    buildTextField({
      id: 'passportNumber',
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
      space: 'containerGutter',
    }),
    buildRadioField({
      id: 'status',
      title: m.statusTitle,
      width: 'half',
      largeButtons: false,
      space: 'containerGutter',
      defaultValue: PassportStatus.LOST,
      options: () => [
        {
          value: PassportStatus.LOST,
          label: m.statusLost,
        },
        {
          value: PassportStatus.STOLEN,
          label: m.statusStolen,
        },
      ],
    }),
    buildDescriptionField({
      id: 'space',
      title: m.commentTitle,
      titleVariant: 'h5',
      space: 'containerGutter',
    }),
    buildTextField({
      id: 'comment',
      title: '',
      variant: 'textarea',
      placeholder: m.commentPlaceholder,
      backgroundColor: 'white',
      rows: 7,
    }),
  ],
})
