import {
  buildForm,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const prerequisites: Form = buildForm({
  id: 'prerequisites',
  title: m.introTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      title: m.introTitle,
      description: m.introDescription,
      children: [
        buildSubmitField({
          id: 'prereqs.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.introSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
