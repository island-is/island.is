import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import Logo from '../assets/Logo'

export const OtherParentApproval: Form = buildForm({
  id: 'OtherParentApprovalForParentalLeave',
  title: 'Other parent approval for parental leave application',
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: 'Other parent approval',
      children: [
        buildMultiField({
          id: 'multi',
          title:
            'Do you want to give away one month of your parental leave rights?',
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              description:
                'You are apparently expecting a baby with some person that wishes to use one month of your rights. That means your rights will be 5 months at most. Do you agree?',
            }),
            buildSubmitField({
              id: 'submit',
              title: 'submit',
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
          title: 'Takk fyrir',
          description:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
