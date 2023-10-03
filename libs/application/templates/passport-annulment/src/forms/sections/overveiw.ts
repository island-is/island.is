import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { STATUS } from '../../lib/constants'
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
      width: 'half',
      value: (application: Application) =>
        (
          application.answers as {
            passportName?: string
          }
        )?.passportName,
    }),
    buildKeyValueField({
      label: m.passportNumber,
      width: 'half',
      value: (application: Application) =>
        (
          application.answers as {
            passportNumber?: string
          }
        )?.passportNumber,
    }),

    buildDescriptionField({
      id: 'overview.space',
      title: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.statusTitle,
      width: 'full',
      value: (application: Application) =>
        application.answers.status === STATUS.LOST
          ? m.statusLost
          : m.statusStolen,
    }),
    buildDescriptionField({
      id: 'overview.space2',
      title: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.commentTitle,
      width: 'full',
      value: (application: Application) =>
        (
          application.answers as {
            comment?: string
          }
        )?.comment,
    }),
    buildDescriptionField({
      id: 'overview.space3',
      title: '',
      space: 'gutter',
    }),
    buildSubmitField({
      id: 'submit',
      placement: 'footer',
      title: '',
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
