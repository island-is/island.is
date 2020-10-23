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
            buildTextField({
              id: 'applicant.institution',
              name: m.institution,
              disabled: false,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.ministry',
              name: m.ministry,
              disabled: false,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.contact',
              name: m.contact,
              disabled: false,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.email,
              disabled: false,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.phoneNumber,
              disabled: false,
              width: 'half',
              variant: 'tel',
            }),
            buildDividerField({ name: 'Þjónusta' }),
            buildTextField({
              id: 'service.name',
              name: m.serviceName,
              disabled: false,
              width: 'half',
            }),
            buildTextField({
              id: 'service.countPerYEar',
              name: m.serviceCount,
              disabled: false,
              width: 'half',
              variant: 'number',
            }),
            buildTextField({
              id: 'service.users',
              name: m.serviceUsers,
              disabled: false,
              width: 'half',
            }),
            buildRadioField({
              id: 'service.digital',
              name: m.serviceDigital,
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
            buildDividerField({ name: 'Greiðlur' }),
            buildRadioField({
              id: 'payment.radio',
              name: m.paymentRadio,
              disabled: false,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'payment.tbr',
              name: m.paymentTBR,
              disabled: false,
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
              disabled: false,
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
              disabled: false,
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
              id: 'other.info',
              name: m.otherInfo,
              variant: 'textarea',
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              name: m.reviewQuestion,
              actions: [
                { event: 'APPROVE', name: m.approveOption, type: 'primary' },
                { event: 'REJECT', name: m.declineOption, type: 'reject' },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
