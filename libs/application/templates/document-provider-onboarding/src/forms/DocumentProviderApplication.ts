import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildIntroductionField,
  buildTextField,
  Form,
  ApplicationTypes,
} from '@island.is/application/core'
import { m } from './messages'

export const ContactInfo: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.formName,
  children: [
    buildSection({
      id: 'applicant',
      name: m.applicantSection,
      children: [
        buildMultiField({
          id: 'applicant',
          name: m.applicantTitle,
          description: m.applicantTitle.description,
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
    buildSection({
      id: 'contacts',
      name: m.contacts,
      children: [
        buildSubSection({
          id: 'administrativeContact',
          name: m.administrativeContactSection,
          children: [
            buildMultiField({
              id: 'administrativeContact',
              name: m.administrativeContactTitle,
              description: m.administrativeContactTitle.description,
              children: [
                buildTextField({
                  id: 'administrativeContact.name',
                  name: m.administrativeContactName,
                }),
                buildTextField({
                  id: 'administrativeContact.email',
                  name: m.administrativeContactEmail,
                }),
                buildTextField({
                  id: 'administrativeContact.phoneNumber',
                  name: m.administrativeContactPhoneNumber,
                }),
                buildTextField({
                  id: 'administrativeContact.address',
                  name: m.administrativeContactAddress,
                }),
                buildTextField({
                  id: 'administrativeContact.zipCode',
                  name: m.administrativeContactZipCode,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'technicalContactA',
          name: m.technicalContactASection,
          children: [
            buildMultiField({
              id: 'technicalContactA',
              name: m.technicalContactATitle,
              description: m.technicalContactATitle.description,
              children: [
                buildTextField({
                  id: 'technicalContactA.name',
                  name: m.technicalContactAName,
                }),
                buildTextField({
                  id: 'technicalContactA.email',
                  name: m.technicalContactAEmail,
                }),
                buildTextField({
                  id: 'technicalContactA.phoneNumber',
                  name: m.technicalContactAPhoneNumber,
                }),
                buildTextField({
                  id: 'technicalContactA.address',
                  name: m.technicalContactAAddress,
                }),
                buildTextField({
                  id: 'technicalContactA.zipCode',
                  name: m.technicalContactAZipCode,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmationSection,
      children: [
        buildIntroductionField({
          id: 'overview',
          name: m.overview,
          introduction: m.overviewIntro,
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk',
          introduction: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
