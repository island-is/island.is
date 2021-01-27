import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  m as mm,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { otherParentApprovalForm as m } from '../lib/messages'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: m.reviewSection,
      children: [
        buildMultiField({
          id: 'multi',
          title: m.multiTitle,
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              description: m.introDescription,
            }),
            buildSubmitField({
              id: 'submit',
              title: mm.buttonSubmit,
              placement: 'footer',
              actions: [
                { name: 'Reject', type: 'reject', event: 'REJECT' },
                { name: 'Approve', type: 'primary', event: 'APPROVE' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: mm.thanks,
          description: mm.thanksDescription,
        }),
      ],
    }),
  ],
})
