import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { PassportStatus } from '../../lib/constants'
import { m } from '../../lib/messages'

export const overview = buildMultiField({
  id: 'overviewPersonalInfo',
  title: m.overview,
  description: m.overviewDescription,
  children: [
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewPI.infoTitle',
      title: m.infoTitle,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'full',
      value: (application: Application) =>
        (
          application.answers as {
            passportName?: string
          }
        )?.passportName,
    }),
    buildDescriptionField({
      id: 'overview.space0',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.passportNumber,
      width: 'full',
      value: (application: Application) =>
        (
          application.answers as {
            passportNumber?: string
          }
        )?.passportNumber,
    }),
    buildDescriptionField({
      id: 'overview.space1',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.statusTitle,
      width: 'full',
      value: (application: Application) =>
        application.answers.status === PassportStatus.LOST
          ? m.statusLost
          : m.statusStolen,
    }),
    buildDescriptionField({
      id: 'overview.space2',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.confirmTitle',
      title: m.confirmTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      marginBottom: 2,
    }),
    buildDescriptionField({
      id: 'overview.confirmDescription',
      description: m.confirmDescription,
      marginBottom: 3,
    }),
    buildCheckboxField({
      id: 'confirmAnnulment',
      backgroundColor: 'white',
      defaultValue: [],
      large: false,
      options: () => [
        {
          value: YES,
          label: m.confirmCheckboxLabel,
        },
      ],
    }),
    buildSubmitField({
      id: 'submit',
      placement: 'footer',
      refetchApplicationAfterSubmit: true,
      actions: [
        {
          event: DefaultEvents.SUBMIT,
          name: m.submitApplication,
          type: 'primary',
        },
      ],
    }),
  ],
})
