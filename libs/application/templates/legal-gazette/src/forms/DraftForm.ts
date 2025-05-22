import {
  buildAlertMessageField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildTextField,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import format from 'date-fns/format'
import { LGBaseEntity } from '../utils/types'

export const DraftForm: Form = buildForm({
  id: 'DraftForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      title: m.requirements.approval.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'draft.section',
      title: m.draft.sections.advert.sectionTitle,
      children: [
        buildMultiField({
          title: m.draft.sections.advert.formTitle,
          children: [
            buildDescriptionField({
              id: 'draft.description',
              description: m.draft.sections.advert.formIntro,
              marginBottom: [2, 3, 4],
            }),
            buildSelectField({
              id: 'application.categoryId',
              title: m.draft.sections.advert.categoryInput,
              options: ({ externalData }) => {
                const categories = getValueViaPath<LGBaseEntity[]>(
                  externalData,
                  'categories.data',
                  [],
                )

                if (!categories) return []

                return categories.map((c) => ({ label: c.title, value: c.id }))
              },
            }),
            buildTextField({
              id: 'application.caption',
              minLength: 1,
              required: true,
              title: m.draft.sections.advert.captionInput,
              size: 'sm',
              marginBottom: [2, 3, 4],
            }),
            buildCustomField({
              id: 'application.html',
              component: 'AdvertField',
              marginBottom: [2, 3, 4],
            }),
            buildDescriptionField({
              id: 'draft.signature',
              title: m.draft.sections.signature.formTitle,
              titleVariant: 'h4',
              marginTop: [2, 3, 4],
            }),
            buildTextField({
              required: true,
              id: 'signature.location',
              title: m.draft.sections.signature.location,
              width: 'half',
              backgroundColor: 'blue',
              size: 'sm',
            }),
            buildDateField({
              required: true,
              id: 'signature.date',
              title: m.draft.sections.signature.date,
              width: 'half',
              size: 'sm',
              backgroundColor: 'blue',
              placeholder: () => {
                const now = new Date()

                return format(now, 'dd.MM.yyyy')
              },
            }),
            buildTextField({
              required: true,
              id: 'signature.name',
              title: m.draft.sections.signature.name,
              width: 'half',
              backgroundColor: 'blue',
              size: 'sm',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'publishing',
      title: m.draft.sections.publishing.sectionTitle,
      children: [
        buildMultiField({
          id: 'publishing.form',
          title: m.draft.sections.publishing.formTitle,
          children: [
            buildDescriptionField({
              id: 'publishing.formIntro',
              description: m.draft.sections.publishing.formIntro,
              marginBottom: [3, 4, 5],
            }),
            buildCustomField({
              id: 'publishing.dates',
              component: 'PublishingDates',
            }),
            buildDescriptionField({
              id: 'communication.formTitle',
              title: m.draft.sections.communication.formTitle,
              titleVariant: 'h4',
              marginTop: [3, 4, 5],
            }),
            buildDescriptionField({
              id: 'communication.formIntro',
              description: m.draft.sections.communication.formIntro,
              marginBottom: [2, 3],
            }),
            buildCustomField({
              id: 'communication.channels',
              component: 'CommunicationChannels',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'preview',
      title: m.draft.sections.preview.sectionTitle,
      children: [
        buildMultiField({
          id: 'preview.form',
          title: m.draft.sections.preview.formTitle,
          children: [
            buildDescriptionField({
              id: 'preview.formIntro',
              description: m.draft.sections.preview.formIntro,
              marginBottom: [3, 4, 5],
            }),
            buildCustomField({
              id: 'preview.advertPreview',
              component: 'AdvertPreview',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.draft.sections.confirmation.sectionTitle,
      children: [
        buildMultiField({
          id: 'confirmation.form',
          title: m.draft.sections.confirmation.formTitle,
          children: [
            buildDescriptionField({
              id: 'confirmation.formIntro',
              description: m.draft.sections.confirmation.formIntro,
              marginBottom: [2, 3],
            }),
            buildAlertMessageField({
              id: 'confirmation.alertMessage',
              alertType: 'info',
              title: m.draft.sections.confirmation.infoTitle,
              message: m.draft.sections.confirmation.infoMessage,
              marginBottom: [3, 4, 5],
            }),
            buildCustomField({
              id: 'confirmation.confirmation',
              component: 'Confirmation',
            }),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonNext,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: { type: 'SUBMIT' },
                  name: m.draft.sections.confirmation.submitButton,
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
