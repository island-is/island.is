import {
  buildAlertMessageField,
  buildCustomField,
  buildExpandableDescriptionField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  coreMessages,
} from '@island.is/application/core'
import { conclusion } from '../../../lib/messages'

export const conclusionSection = buildSection({
  id: 'conclusion',
  title: conclusion.general.title,
  children: [
    buildMultiField({
      id: 'uiForms.conclusionMultifield',
      title: conclusion.general.title,
      children: [
        buildAlertMessageField({
          id: 'uiForms.conclusionAlert',
          title: conclusion.default.alertTitle,
          alertType: 'success',
        }),
        buildExpandableDescriptionField({
          id: 'uiForms.conclusionExpandableDescription',
          title: conclusion.default.accordionTitle,
          introText: '',
          description: conclusion.default.accordionText,
          startExpanded: true,
        }),
        buildCustomField({
          id: 'pdfoverview',
          component: 'PdfOverview',
        }),
        buildMessageWithLinkButtonField({
          id: 'uiForms.conclusionBottomLink',
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
          marginBottom: [4, 4, 12],
        }),
      ],
    }),
  ],
})
