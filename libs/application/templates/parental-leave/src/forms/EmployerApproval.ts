import {
  buildCustomField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import Logo from '../assets/Logo'

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  name: 'Employer approval for parental leave application',
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      name: 'Employer approval',
      children: [
        buildMultiField({
          id: 'multi',
          name:
            'Your employee has applied for parental leave. Do you approve of his/her selected periods?',
          children: [
            buildCustomField(
              {
                id: 'intro',
                name: '',
                component: 'PeriodsRepeater',
              },
              {
                editable: false,
              },
            ),
            buildSubmitField({
              id: 'submit',
              name: 'submit',
              placement: 'footer',
              actions: [
                { name: 'Reject', type: 'reject', event: 'REJECT' },
                { name: 'Approve', type: 'primary', event: 'APPROVE' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk fyrir',
          introduction:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
