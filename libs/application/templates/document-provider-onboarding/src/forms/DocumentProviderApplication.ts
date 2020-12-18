import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  Form,
  ApplicationTypes,
  FormModes,
  buildSubmitField,
  buildCustomField,
  buildDividerField,
} from '@island.is/application/core'
import { m } from './messages'

export const DocumentProviderOnboarding: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'termsOfAgreement',
      name: m.termsSection,
      children: [
        buildCustomField(
          {
            id: 'termsOfAgreement',
            name: m.termsTitle,
            description: m.termsSubTitle,
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
              format: '######-####',
              placeholder: m.applicantNationalIdPlaceholder,
            }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
              placeholder: m.applicantNamePlaceholder,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
              placeholder: m.applicantAddressPlaceholder,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
              placeholder: m.applicantZipCodePlaceholder,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              variant: 'email',
              placeholder: m.applicantEmailPlaceholder,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.applicantPhoneNumberPlaceholder,
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
              placeholder: m.administrativeContactNamePlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              variant: 'email',
              placeholder: m.administrativeContactEmailPlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.administrativeContactPhoneNumberPlaceholder,
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
              placeholder: m.technicalContactNamePlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              variant: 'email',
              placeholder: m.technicalContactEmailPlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.technicalContactPhoneNumberPlaceHolder,
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
              placeholder: m.helpDeskEmailPlaceholder,
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              name: m.helpDeskPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.helpDeskPhoneNumberPlaceholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmationSection,
      children: [
        buildMultiField({
          id: 'confirmation',
          name: m.confirmationTitle,
          description: m.confirmationSubTitle,
          children: [
            //Error in dev tools, missing keys on divider fields...
            buildDividerField({
              name: m.applicantSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              name: m.applicantNationalId,
              format: '######-####',
              placeholder: m.applicantNationalIdPlaceholder,
            }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
              placeholder: m.applicantNamePlaceholder,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
              placeholder: m.applicantAddressPlaceholder,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
              placeholder: m.applicantZipCodePlaceholder,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              variant: 'email',
              placeholder: m.applicantEmailPlaceholder,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.applicantPhoneNumberPlaceholder,
            }),
            //Error in dev tools, missing keys on divider fields...
            buildDividerField({
              name: m.administrativeContactSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
              placeholder: m.administrativeContactNamePlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              variant: 'email',
              placeholder: m.administrativeContactEmailPlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.administrativeContactPhoneNumberPlaceholder,
            }),
            //Error in dev tools, missing keys on divider fields...
            buildDividerField({
              name: m.technicalContactSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
              placeholder: m.technicalContactNamePlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              variant: 'email',
              placeholder: m.technicalContactEmailPlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.technicalContactPhoneNumberPlaceHolder,
            }),
            //Error in dev tools, missing keys on divider fields...
            buildDividerField({
              name: m.helpDeskSection,
              color: 'currentColor',
            }),
            //CustomField is a workaround because of a bug in react-hook-form
            buildCustomField({
              id: 'helpDeskConfirmation',
              name: 'helpDeskConfirmation',
              component: 'Review',
            }),

            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: m.confirmationSubmitButton,

              actions: [
                {
                  event: 'SUBMIT',
                  name: m.confirmationSubmitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField(
          {
            id: 'thankYouScreen',
            name: m.thankYouScreenTitle,
            component: 'ThankYouScreen',
          },
          {},
        ),
      ],
    }),
  ],
})
