import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildCheckboxField,
  buildIntroductionField,
  buildRadioField,
  buildTextField,
  Form,
  Comparators,
  ApplicationTypes,
  FormValue,
  buildRepeater,
} from '@island.is/application/core'
import { m } from './messages'

export const ApplicationForm: Form = buildForm({
  id: ApplicationTypes.APPLICATION_APPLICATION,
  ownerId: 'DOL',
  name: 'Meta application',
  children: [
    buildSection({
      id: 'intro',
      name: m.generalInfo,
      children: [
        buildMultiField({
          id: 'general',
          name: m.generalInfo,
          children: [
            buildTextField({
              id: 'applicant.institution',
              name: m.institution,
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.ministry',
              name: m.ministry,
              required: false,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.contact',
              name: m.contact,
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.email,
              required: false,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.phoneNumber,
              required: false,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'service',
      name: m.service,
      children: [
        buildSubSection({
          id: 'service.general',
          name: m.serviceGeneral,
          children: [
            buildMultiField({
              id: 'service.general.fields',
              name: m.serviceGeneral,
              children: [
                buildTextField({
                  id: 'service.name',
                  name: m.serviceName,
                  required: false,
                  width: 'half',
                }),
                buildTextField({
                  id: 'service.countPerYEar',
                  name: m.serviceCount,
                  required: false,
                  width: 'half',
                }),
                buildTextField({
                  id: 'service.users',
                  name: m.serviceUsers,
                  required: false,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'service.current',
          name: m.serviceCurrent,
          children: [
            buildMultiField({
              id: 'service.current.fields',
              name: m.serviceCurrent,
              children: [
                buildRadioField({
                  id: 'service.digital',
                  name: m.serviceDigital,
                  required: true,
                  options: [
                    { value: 'yes', label: m.yesOptionLabel },
                    { value: 'no', label: m.noOptionLabel },
                  ],
                }),
                buildTextField({
                  id: 'service.link',
                  name: m.serviceLink,
                  required: false,
                  width: 'half',
                  condition: (formValue: FormValue) => {
                    console.log('FORMVAL__', formValue)
                    return (
                      (formValue as { service: { digital: string } })?.service
                        ?.digital === 'yes'
                    )
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'dataCollection',
      name: m.data,
      children: [
        buildRepeater({
          id: 'data',
          name: 'Hvaða gögn þarf að skila með umsókn?',
          component: 'DataRepeater',
          children: [
            buildMultiField({
              id: 'data.fields',
              name: m.data,
              children: [
                buildTextField({
                  id: 'data.name',
                  name: m.dataName,
                  required: false,
                  width: 'half',
                }),
                buildTextField({
                  id: 'data.publisher',
                  name: m.dataPublisher,
                  required: false,
                  width: 'half',
                }),
                buildTextField({
                  id: 'data.download',
                  name: m.dataDownload,
                  required: false,
                  width: 'half',
                }),
                buildTextField({
                  id: 'data.upload',
                  name: m.dataUpload,
                  required: false,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      name: m.payment,
      children: [
        buildMultiField({
          id: 'payment.fields',
          name: m.payment,
          children: [
            buildRadioField({
              id: 'payment.radio',
              name: m.paymentRadio,
              required: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'payment.tbr',
              name: m.paymentTBR,
              required: false,
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
              required: false,
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
              required: false,
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
          ],
        }),
      ],
    }),
    buildSection({
      id: 'other',
      name: m.other,
      children: [
        buildTextField({
          id: 'other.info',
          name: m.otherInfo,
          required: false,
        }),
      ],
    }),
  ],
})
