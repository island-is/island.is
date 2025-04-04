import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const DraftForm: Form = buildForm({
  id: 'DraftDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      title: 'Upplýsingar',
      children: [],
    }),
    buildSection({
      id: 'draft_section',
      children: [
        buildDescriptionField({
          id: 'draft_description',
          title: 'Uppsetning',
          description: 'Hér getur þú skoðað og breytt umsókninni þinni.',
        }),
        buildSubmitField({
          id: 'submit',
          title: coreMessages.buttonNext,
          actions: [
            {
              event: { type: 'SUBMIT' },
              name: 'Staðfesta',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
