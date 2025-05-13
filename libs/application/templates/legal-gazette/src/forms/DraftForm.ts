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
          space: 5,
          children: [
            buildDescriptionField({
              id: 'draft.description',
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
