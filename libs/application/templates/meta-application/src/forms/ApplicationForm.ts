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
            buildAsyncSelectField({
              id: 'applicant.institution',
              name: m.institution,
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
              name: m.ministry,
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
              name: m.contact,
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
              format: '###-####',
              placeholder: '000-0000',
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
                  id: 'service.countPerYear',
                  name: m.serviceCount,
                  width: 'half',
                  variant: 'number',
                }),
                buildRadioField({
                  id: 'service.users',
                  name: m.serviceUsers,
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
          name: m.serviceCurrent,
          children: [
            buildMultiField({
              id: 'service.current.fields',
              name: m.serviceCurrent,
              children: [
                buildRadioField({
                  id: 'service.digital',
                  name: m.serviceDigital,
                  largeButtons: true,
                  width: 'half',
                  options: [
                    { value: 'yes', label: m.yesOptionLabel },
                    { value: 'no', label: m.noOptionLabel },
                  ],
                }),
                buildTextField({
                  id: 'service.link',
                  name: m.serviceLink,
                  placeholder: 'https://www.someUrl.is',
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
          name: 'Hvaða gögn þurfa að fylgja umsókninni?',
          component: 'DataRepeater',
          children: [
            buildMultiField({
              id: 'data.fields',
              name: m.data,
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
                buildRadioField({
                  id: 'download',
                  name: m.dataDownload,
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
      name: m.payment,
      children: [
        buildMultiField({
          id: 'payment.fields',
          name: m.payment,
          children: [
            buildRadioField({
              id: 'payment.radio',
              name: m.paymentRadio,
              largeButtons: true,
              width: 'half',
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
              name: m.paymentCharge,
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
      name: m.other,
      children: [
        buildMultiField({
          id: 'confirmation',
          name: m.otherInfo,
          children: [
            buildTextField({
              id: 'info',
              name: '',
              variant: 'textarea',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: m.submit,
              actions: [{ event: 'SUBMIT', name: m.submit, type: 'primary' }],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'final',
      name: m.final,
      children: [
        buildDescriptionField({
          id: 'final.intro',
          name: 'Takk fyrir',
          description: 'Umsókn þín hefur verið send',
        }),
      ],
    }),
  ],
})
