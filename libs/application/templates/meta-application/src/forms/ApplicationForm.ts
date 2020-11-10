import {
  ApplicationTypes,
  buildCustomField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'

export const ApplicationForm: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: 'Meta application',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      name: m.generalInfo,
      children: [
        buildMultiField({
          id: 'general',
          name: m.generalInfo,
          children: [
            buildCustomField({
              id: 'applicant.institution',
              name: m.institution,
              component: 'OrganizationField',
            }),
            buildTextField({
              id: 'applicant.contact',
              name: m.contact,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.email,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.phoneNumber,
              width: 'half',
              variant: 'tel',
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
                  width: 'half',
                }),
                buildTextField({
                  id: 'service.countPerYEar',
                  name: m.serviceCount,
                  width: 'half',
                  variant: 'number',
                }),
                buildRadioField({
                  id: 'service.users',
                  name: m.serviceUsers,
                  options: [
                    { value: 'companies', label: m.companiesOptionLabel },
                    { value: 'individuals', label: m.individualsOptionLabel },
                    { value: 'both', label: m.bothOptionLabel },
                  ],
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
              name: '',
              children: [
                buildTextField({
                  id: 'name',
                  name: m.dataName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'publisher',
                  name: m.dataPublisher,
                  width: 'half',
                }),
                buildTextField({
                  id: 'download',
                  name: m.dataDownload,
                  width: 'half',
                }),
                buildTextField({
                  id: 'upload',
                  name: m.dataUpload,
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
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildTextField({
              id: 'payment.tbr',
              name: m.paymentTBR,
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
          id: 'info',
          name: m.otherInfo,
          variant: 'textarea',
        }),
      ],
    }),
    buildSection({
      id: 'final',
      name: m.final,
      children: [
        buildIntroductionField({
          id: 'final.intro',
          name: 'Takk fyrir',
          introduction: 'Umsókn þín hefur verið send',
        }),
      ],
    }),
  ],
})
