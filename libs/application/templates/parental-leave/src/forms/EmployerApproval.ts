import {
  buildCustomField,
  buildForm,
  buildIntroductionField,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

const yesOption = { value: 'yes', label: 'Já' }
const noOption = { value: 'no', label: 'Nei' }

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  name: 'Employer approval for parental leave application',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      name: 'Employer approval',
      children: [
        buildCustomField(
          {
            id: 'intro',
            name:
              'Your employee has applied for parental leave. Do you approve of his/her selected periods?',
            component: 'PeriodsRepeater',
          },
          {
            editable: false,
          },
        ),
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
