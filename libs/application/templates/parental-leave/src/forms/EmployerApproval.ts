import {
  buildCustomField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import Logo from '../assets/Logo'

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  title: 'Employer approval for parental leave application',
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: 'Employer approval',
      children: [
        buildMultiField({
          id: 'multi',
          title:
            'Your employee has applied for parental leave. Do you approve of his/her selected periods?',
          children: [
            buildCustomField(
              {
                id: 'intro',
                title: '',
                component: 'PeriodsRepeater',
              },
              {
                editable: false,
              },
            ),
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
