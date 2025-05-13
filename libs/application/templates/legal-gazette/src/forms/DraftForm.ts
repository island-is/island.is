import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import format from 'date-fns/format'

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
            buildTextField({
              required: true,
              id: 'signature.date',
              title: m.draft.sections.signature.date,
              width: 'half',
              backgroundColor: 'blue',
              placeholder: () => {
                const now = new Date()

                return format(now, 'dd.MM.yyyy')
              },
              size: 'sm',
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
              marginBottom: 5,
            }),
            buildCustomField({
              id: 'publishing.dates',
              component: 'PublishingDates',
            }),
            buildDescriptionField({
              id: 'communication.formTitle',
              title: m.draft.sections.communication.formTitle,
              titleVariant: 'h4',
              marginTop: 5,
            }),
            buildDescriptionField({
              id: 'communication.formIntro',
              description: m.draft.sections.communication.formIntro,
              marginBottom: 3,
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
      id: 'confirmation',
      title: 'Staðfesting',
      children: [
        buildMultiField({
          id: 'confirmation.form',
          title: 'Staðfesting',
          children: [
            buildDescriptionField({
              id: 'confirmation.formIntro',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet mattis erat, eget dignissim lacus. Cras id enim ac urna bibendum gravida. Donec ultricies dapibus lacinia. Curabitur ut est urna. Donec id eleifend erat. Nam et posuere arcu.',
            }),
            buildAlertMessageField({
              id: 'confirmation.alertMessage',
              alertType: 'info',
              title: 'Vinsamlega athugið!',
              message:
                'Auglýsingar í Lögbirtingablaði eru undanskildar virðisaukaskatti samkvæmt ákvörðun ríkisskattstjóra',
            }),
            buildKeyValueField({
              display: 'flex',
              label: 'Sendandi',
              value: (application) => {
                return application.applicant
              },
              marginTop: 5,
              paddingY: 2,
            }),
            buildDividerField({}),
            buildKeyValueField({
              display: 'flex',
              label: 'Áætlað verð',
              value: '0 kr.',
              paddingY: 2,
            }),
            buildDividerField({}),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonNext,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: { type: 'SUBMIT' },
                  name: 'Staðfesta og senda inn auglýsingu',
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
