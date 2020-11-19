import {
  buildForm,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildTextField,
  Form,
  ApplicationTypes,
  FormValue,
  buildDividerField,
  buildSubmitField,
  FormModes,
  buildCustomField,
  buildIntroductionField,
} from '@island.is/application/core'
import { m } from './messages'

export const Review: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      name: m.generalInfo,
      children: [
        buildMultiField({
          id: 'general',
          name: '',
          children: [
            buildDividerField({ name: 'Grunnuppplýingar' }),
            buildCustomField(
              {
                id: 'applicant.institution',
                name: m.institution,
                component: 'OrganizationField',
              },
              { disabled: true },
            ),
            buildTextField({
              id: 'applicant.contact',
              name: m.contact,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.email,
              disabled: true,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.phoneNumber,
              disabled: true,
              width: 'half',
              variant: 'tel',
            }),
            buildDividerField({ name: 'Þjónusta' }),
            buildTextField({
              id: 'service.name',
              name: m.serviceName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'service.countPerYEar',
              name: m.serviceCount,
              disabled: true,
              width: 'half',
              variant: 'number',
            }),
            buildRadioField({
              id: 'service.users',
              name: m.serviceUsers,
              disabled: true,
              options: [
                { value: 'companies', label: m.companiesOptionLabel },
                { value: 'individuals', label: m.individualsOptionLabel },
                { value: 'both', label: m.bothOptionLabel },
              ],
            }),
            buildRadioField({
              id: 'service.digital',
              name: m.serviceDigital,
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'service.link',
              name: m.serviceLink,
              width: 'half',
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { service: { digital: string } })?.service
                    ?.digital === 'yes'
                )
              },
            }),
            buildDividerField({ name: 'Gögn' }),
            buildCustomField({
              id: 'dataTable',
              name: '',
              component: 'DataTable',
            }),
            buildDividerField({ name: 'Greiðlur' }),
            buildRadioField({
              id: 'payment.radio',
              name: m.paymentRadio,
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'payment.tbr',
              name: m.paymentTBR,
              disabled: true,
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { payment: { radio: string } })?.payment
                    ?.radio === 'yes'
                )
              },
            }),
            buildTextField({
              id: 'payment.amount',
              name: m.paymentAmount,
              variant: 'number',
              disabled: true,
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { payment: { radio: string } })?.payment
                    ?.radio === 'yes'
                )
              },
            }),
            buildRadioField({
              id: 'payment.charge',
              name: m.paymentCharge,
              disabled: true,
              options: [
                { value: 'in advance', label: m.inAdvanceOptionLabel },
                { value: 'on approval', label: m.onApprovalOptionLabel },
              ],
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { payment: { radio: string } })?.payment
                    ?.radio === 'yes'
                )
              },
            }),
            buildDividerField({ name: 'Annað' }),
            buildTextField({
              id: 'info',
              name: m.otherInfo,
              variant: 'textarea',
              disabled: true,
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              name: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: m.approveOption, type: 'primary' },
                { event: 'REJECT', name: m.declineOption, type: 'reject' },
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
