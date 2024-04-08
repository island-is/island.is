import {
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
    buildRadioField({
      id: 'passportStatus',
      title: m.statusTitle,
      width: 'half',
      largeButtons: false,
      space: 'containerGutter',
      defaultValue: [],
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
  ],
})
