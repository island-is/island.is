import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildIntroductionField,
  buildTextField,
  Form,
  ApplicationTypes,
  FormModes,
  buildSubmitField,
  buildCheckboxField,
  buildFileUploadField,
  buildCustomField
  
} from '@island.is/application/core'
import { m } from './messages'

export const DocumentProviderOnboarding: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'terms and conditions agreement',
      name: m.termsSection,
      children: [
        buildCustomField(
          {
            id: 'termsOfAgreement',
            name: 'Skilmálar',
            component: 'TermsOfAgreement',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'applicant',
      name: m.applicantSection,
      children: [
        buildMultiField({
          id: 'applicant',
          name: m.applicantTitle,
          description: m.applicantSubTitle,
          children: [
            buildTextField({
              id: 'applicant.nationalId',
              name: m.applicantNationalId,
            }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              variant: 'tel',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'administrativeContact',
      name: m.administrativeContactSection,
      children: [
        buildMultiField({
          id: 'administrativeContact',
          name: m.administrativeContactTitle,
          description: m.administrativeContactSubTitle,
          children: [
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              variant: 'tel',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'technicalContact',
      name: m.technicalContactSection,
      children: [
        buildMultiField({
          id: 'technicalContact',
          name: m.technicalContactTitle,
          description: m.technicalContactSubTitle,
          children: [
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              variant: 'tel',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'helpDesk',
      name: m.helpDeskSection,
      children: [
        buildMultiField({
          id: 'helpDesk',
          name: m.helpDeskTitle,
          description: m.helpDeskSubTitle,
          children: [
            buildTextField({
              id: 'helpDesk.email',
              name: m.helpDeskEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              name: m.helpDeskPhoneNumber,
              variant: 'tel',
            }),
            buildTextField({
              id: 'helpDesk.chatbot',
              name: m.helpDeskChatbot,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'documents',
      name: m.documentsSection,
      children: [
        buildIntroductionField({
          id: 'fileUpload',
          name: 'TODO',
          introduction: 'TODO',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmationSection,
      children: [
        buildMultiField({
          id: 'overview',
          name: m.overview,
          description: m.overviewIntro,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'Senda inn umsókn',

              actions: [
                { event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
          ],
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
