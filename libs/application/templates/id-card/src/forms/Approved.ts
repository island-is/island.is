import {
  buildForm,
  buildSection,
  buildMultiField,
  buildAlertMessageField,
  buildMessageWithLinkButtonField,
  buildExpandableDescriptionField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewConfirmation } from '../lib/messages'

export const Approved: Form = buildForm({
  id: 'Approved',
  title: '',
  // logo: Logo,
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'uiForms.conclusionSection',
      title: reviewConfirmation.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'uiForms.conclusionMultifield',
          title: reviewConfirmation.general.sectionTitle,
          children: [
            buildAlertMessageField({
              id: 'uiForms.conclusionAlert',
              title: reviewConfirmation.general.alertTitle,
              alertType: 'success',
            }),
            buildExpandableDescriptionField({
              id: 'uiForms.conclusionExpandableDescription',
              title: reviewConfirmation.general.accordionTitle,
              introText: '',
              description: reviewConfirmation.general.accordionText,
              startExpanded: true,
            }),
            buildAlertMessageField({
              id: 'uiForms.conclusionAlertInfo1',
              title: '',
              alertType: 'info',
              message: reviewConfirmation.general.infoMessageText2,
            }),
            buildAlertMessageField({
              id: 'uiForms.conclusionAlertInfo2',
              title: '',
              alertType: 'info',
              message: reviewConfirmation.general.infoMessageText2,
            }),
            buildMessageWithLinkButtonField({
              id: 'uiForms.conclusionBottomLink',
              title: '',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: reviewConfirmation.general.bottomButtonMessage,
              marginBottom: [4, 4, 12],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      sectionTitle: reviewConfirmation.general.sectionTitle,
      multiFieldTitle: reviewConfirmation.general.sectionTitle,
      alertTitle: reviewConfirmation.general.alertTitle,
      alertMessage: '',
      expandableHeader: reviewConfirmation.general.accordionTitle,
      expandableIntro: '',
      expandableDescription: reviewConfirmation.general.accordionText,
      bottomButtonMessage: reviewConfirmation.general.bottomButtonMessage,
    }),
  ],
})
