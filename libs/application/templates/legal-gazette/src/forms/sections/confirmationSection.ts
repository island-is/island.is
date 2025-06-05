import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildAlertMessageField,
  buildSubmitField,
  coreMessages,
  buildOverviewField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getConfirmationOverview } from '../../utils/utils'

export const confirmationSection = buildSection({
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
        buildOverviewField({
          id: 'confirmation.overview',
          titleVariant: 'h4',
          title: '',
          items: getConfirmationOverview,
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
})
