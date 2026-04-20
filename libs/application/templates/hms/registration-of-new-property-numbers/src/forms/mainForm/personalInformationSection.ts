import { buildMultiField, buildSection } from '@island.is/application/core'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { personalInformationMessages } from '../../lib/messages'

const fieldsToRemove = [
  'applicant.address',
  'applicant.postalCode',
  'applicant.city',
  'applicant.postalCodeAndCity',
]

export const personalInformationSection = buildSection({
  id: 'personalInformationSection',
  title: personalInformationMessages.title,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: personalInformationMessages.title,
      description: personalInformationMessages.description,
      children: [
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
          baseInfoReadOnly: true,
          emailAndPhoneReadOnly: true,
          compactFields: true,
        }).children.filter((field) => !fieldsToRemove.includes(field.id)),
      ],
    }),
  ],
})
