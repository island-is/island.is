import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const DraftForm: Form = buildForm({
  id: 'DraftDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      title: m.requirements.approval.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'draft_section',
      title: m.draft.sections.advert.sectionTitle,
      children: [
        buildMultiField({
          title: m.draft.sections.advert.formTitle,
          space: 5,
          children: [
            buildDescriptionField({
              id: 'draft_description',
              description: m.draft.sections.advert.formIntro,
            }),
            buildTextField({
              id: 'application.caption',
              minLength: 1,
              required: true,
              title: m.draft.sections.advert.captionInput,
            }),
            buildCustomField({
              id: 'application.html',
              component: 'AdvertField',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'publishing',
      title: m.draft.sections.publishing.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'publishing.description',
          description: m.draft.sections.publishing.formIntro,
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
