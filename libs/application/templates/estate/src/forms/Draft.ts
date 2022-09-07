import {
  buildForm,
  buildDescriptionField,
  buildSubmitField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

export const Draft: Form = buildForm({
  id: 'draft',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'draft',
      title: 'Ákvörðun um skipti bús – Opinber skipti',
      children: [
        buildMultiField({
          id: 'draft',
          title: '',
          children: [
            buildDescriptionField({
              id: 'draft',
              title: 'Hola amiga',
              description: 'Muy bonita!',
            }),
            buildSubmitField({
              id: 'overview.submitDraft',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
