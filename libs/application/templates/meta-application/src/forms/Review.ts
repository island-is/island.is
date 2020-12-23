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
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from './messages'

export const Review: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  title: 'Úrvinnsla',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.generalInfo,
      children: [
        buildMultiField({
          id: 'general',
          title: 'Umsókn um aðild að umsóknarkerfinu',
          children: [
            buildDividerField({ title: 'Grunnuppplýingar' }),
            buildCustomField(
              {
                id: 'applicant.institution',
                title: m.institution,
                component: 'OrganizationField',
              },
              { disabled: true },
            ),
            buildTextField({
              id: 'applicant.contact',
              title: m.contact,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              disabled: true,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.phoneNumber,
              disabled: true,
              width: 'half',
              variant: 'tel',
            }),
            buildDividerField({ title: 'Þjónusta' }),
            buildTextField({
              id: 'service.name',
              title: m.serviceName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'service.countPerYear',
              title: m.serviceCount,
              disabled: true,
              width: 'half',
              variant: 'number',
            }),
            buildRadioField({
              id: 'service.users',
              title: m.serviceUsers,
              largeButtons: true,
              width: 'half',
              disabled: true,
              options: [
                { value: 'companies', label: m.companiesOptionLabel },
                { value: 'individuals', label: m.individualsOptionLabel },
                { value: 'both', label: m.bothOptionLabel },
              ],
            }),
            buildRadioField({
              id: 'service.digital',
              title: m.serviceDigital,
              largeButtons: true,
              width: 'half',
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'service.link',
              title: m.serviceLink,
              disabled: true,
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { service: { digital: string } })?.service
                    ?.digital === 'yes'
                )
              },
            }),
            buildDividerField({ title: 'Gögn' }),
            buildCustomField({
              id: 'dataTable',
              title: '',
              component: 'DataTable',
            }),
            buildDividerField({ title: 'Greiðlur' }),
            buildRadioField({
              id: 'payment.radio',
              title: m.paymentRadio,
              disabled: true,
              largeButtons: true,
              width: 'half',
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'payment.tbr',
              title: m.paymentTBR,
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
              title: m.paymentAmount,
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
              title: m.paymentCharge,
              disabled: true,
              largeButtons: true,
              width: 'half',
              options: [
                { value: 'inAdvance', label: m.inAdvanceOptionLabel },
                { value: 'onApproval', label: m.onApprovalOptionLabel },
              ],
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { payment: { radio: string } })?.payment
                    ?.radio === 'yes'
                )
              },
            }),
            buildDividerField({ title: 'Annað' }),
            buildTextField({
              id: 'info',
              title: m.otherInfo,
              variant: 'textarea',
              disabled: true,
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              title: m.reviewQuestion,
              placement: 'footer',
              actions: [
                { event: 'REJECT', name: m.declineOption, type: 'reject' },
                { event: 'APPROVE', name: m.approveOption, type: 'primary' },
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
