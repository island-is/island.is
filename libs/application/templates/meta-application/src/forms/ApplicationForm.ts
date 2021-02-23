import {
  ApplicationTypes,
  buildAsyncSelectField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'

import { gql } from '@apollo/client'

type Item = {
  title: string
  id: string
}

type GetOrganizations = {
  getOrganizations:
    | undefined
    | {
        items: Array<Item>
      }
}

type GetOrganizationTags = {
  getOrganizationTags:
    | undefined
    | {
        items: Array<Item>
      }
}

const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        title
        tag {
          id
          title
        }
      }
    }
  }
`

const GET_ORGANIZATION_TAGS_QUERY = gql`
  query GetOrganizationTags($input: GetOrganizationTagsInput!) {
    getOrganizationTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`

export const ApplicationForm: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  title: 'Meta application',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      title: m.generalInfo,
      children: [
        buildMultiField({
          id: 'general',
          title: m.generalInfo,
          children: [
            buildAsyncSelectField({
              id: 'applicant.institution',
              title: m.institution,
              placeholder: m.institution,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<GetOrganizations>({
                  query: GET_ORGANIZATIONS_QUERY,
                  variables: { input: { lang: 'is' } },
                })
                return (
                  data?.getOrganizations?.items.map(({ title, id }) => ({
                    label: title,
                    value: id,
                  })) ?? []
                )
              },
              onSelect: (option, onChange) => {
                onChange({ id: option?.value, title: option?.label })
              },
            }),
            buildAsyncSelectField({
              id: 'applicant.ministry',
              title: m.ministry,
              placeholder: m.ministry,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<GetOrganizationTags>({
                  query: GET_ORGANIZATION_TAGS_QUERY,
                  variables: { input: { lang: 'is' } },
                })
                return (
                  data?.getOrganizationTags?.items.map(({ title, id }) => ({
                    label: title,
                    value: id,
                  })) ?? []
                )
              },
              onSelect: (option, onChange) => {
                onChange({ id: option?.value, title: option?.label })
              },
            }),
            buildTextField({
              id: 'applicant.contact',
              title: m.contact,
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'service',
      title: m.service,
      children: [
        buildSubSection({
          id: 'service.general',
          title: m.serviceGeneral,
          children: [
            buildMultiField({
              id: 'service.general.fields',
              title: m.serviceGeneral,
              children: [
                buildTextField({
                  id: 'service.name',
                  title: m.serviceName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'service.countPerYear',
                  title: m.serviceCount,
                  width: 'half',
                  variant: 'number',
                }),
                buildRadioField({
                  id: 'service.users',
                  title: m.serviceUsers,
                  largeButtons: true,
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
          title: m.serviceCurrent,
          children: [
            buildMultiField({
              id: 'serviceFields',
              title: m.serviceCurrent,
              children: [
                buildRadioField({
                  id: 'serviceFields.digital',
                  title: m.serviceDigital,
                  largeButtons: true,
                  width: 'half',
                  options: [
                    { value: 'yes', label: m.yesOptionLabel },
                    { value: 'no', label: m.noOptionLabel },
                  ],
                }),
                buildTextField({
                  id: 'serviceFields.link',
                  title: m.serviceLink,
                  placeholder: 'https://www.someUrl.is',
                  condition: (formValue: FormValue) => {
                    return (
                      (formValue as { serviceFields: { digital: string } })
                        ?.serviceFields?.digital === 'yes'
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
      title: m.data,
      children: [
        buildRepeater({
          id: 'data',
          title: 'Hvaða gögn þurfa að fylgja umsókninni?',
          component: 'DataRepeater',
          children: [
            buildMultiField({
              id: 'data.fields',
              title: m.data,
              children: [
                buildTextField({
                  id: 'name',
                  title: m.dataName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'publisher',
                  title: m.dataPublisher,
                  width: 'half',
                }),
                buildRadioField({
                  id: 'download',
                  title: m.dataDownload,
                  width: 'half',
                  largeButtons: true,
                  options: [
                    { value: 'yes', label: m.yesOptionLabel },
                    { value: 'no', label: m.noOptionLabel },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [
        buildMultiField({
          id: 'payment.fields',
          title: m.payment,
          children: [
            buildRadioField({
              id: 'payment.acceptsPayment',
              title: m.paymentRadio,
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
              variant: 'currency',
              placeholder: 'kr.',
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
          ],
        }),
      ],
    }),
    buildSection({
      id: 'other',
      title: m.other,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: m.otherInfo,
          children: [
            buildTextField({
              id: 'info',
              title: '',
              variant: 'textarea',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.submit,
              actions: [{ event: 'SUBMIT', name: m.submit, type: 'primary' }],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'final',
      title: m.final,
      children: [
        buildDescriptionField({
          id: 'final.intro',
          title: 'Takk fyrir',
          description: 'Umsókn þín hefur verið send',
        }),
      ],
    }),
  ],
})
