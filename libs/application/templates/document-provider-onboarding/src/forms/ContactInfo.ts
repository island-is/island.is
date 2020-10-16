import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildIntroductionField,
  buildRadioField,
  buildSelectField,
  buildTextField,
  Form,
  DataProviderTypes,
  ApplicationTypes,
  buildDateField,
} from '@island.is/application/core'
import { m } from './messages'

export const ContactInfo: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  ownerId: 'TODO?',
  name: m.formName,
  children: [
    buildSection({
      id: 'applicant',
      name: m.applicantSection,
      children: [
        buildMultiField({
          id: 'applicant',
          name: m.applicantTitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
            }),
          ],
        }),
      ],
    }),
  ],
})
