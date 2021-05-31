import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  coreMessages,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { otherParentApprovalFormMessages } from '../lib/messages'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  title: otherParentApprovalFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: otherParentApprovalFormMessages.reviewSection,
      children: [
        buildMultiField({
          id: 'multi',
          title: otherParentApprovalFormMessages.multiTitle,
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              description: otherParentApprovalFormMessages.introDescription,
            }),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonSubmit,
              placement: 'footer',
              actions: [
                {
                  name: coreMessages.buttonReject,
                  type: 'reject',
                  event: 'REJECT',
                },
                {
                  name: coreMessages.buttonApprove,
                  type: 'primary',
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
