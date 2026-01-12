import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  buildSubmitField,
  buildDescriptionField,
  buildCheckboxField,
  buildLinkField,
  buildTitleField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { Form, ApplicationTypes, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const DocumentProviderOnboarding: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.formName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'termsOfAgreement',
      title: m.termsSection,
      children: [
        buildMultiField({
          id: 'termsOfAgreement',
          title: m.termsTitle,
          children: [
            buildDescriptionField({
              id: 'description',
              description: m.termsSubTitle,
              marginBottom: 3,
            }),
            buildLinkField({
              id: 'link',
              title: m.termsUserAgreementTitle,
              link: m.termsUserAgreementUrl,
              iconProps: { icon: 'open' },
            }),
            buildCheckboxField({
              id: 'termsOfAgreement.userTerms',
              options: [
                { value: YesOrNoEnum.YES, label: m.userAgreementOptionLabel },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: m.applicantSection,
      children: [
        buildMultiField({
          id: 'applicant',
          title: m.applicantTitle,
          description: m.applicantSubTitle,
          children: [
            buildTextField({
              id: 'applicant.nationalId',
              title: m.applicantNationalId,
              format: '######-####',
              placeholder: m.applicantNationalIdPlaceholder,
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.applicantName,
              placeholder: m.applicantNamePlaceholder,
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.applicantEmail,
              variant: 'email',
              placeholder: m.applicantEmailPlaceholder,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.applicantPhoneNumber,
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
      title: m.administrativeContactSection,
      children: [
        buildMultiField({
          id: 'administrativeContact',
          title: m.administrativeContactTitle,
          description: m.administrativeContactSubTitle,
          children: [
            buildTextField({
              id: 'administrativeContact.name',
              title: m.administrativeContactName,
              placeholder: m.administrativeContactNamePlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              title: m.administrativeContactEmail,
              variant: 'email',
              placeholder: m.administrativeContactEmailPlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              title: m.administrativeContactPhoneNumber,
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
      title: m.technicalContactSection,
      children: [
        buildMultiField({
          id: 'technicalContact',
          title: m.technicalContactTitle,
          description: m.technicalContactSubTitle,
          children: [
            buildTextField({
              id: 'technicalContact.name',
              title: m.technicalContactName,
              placeholder: m.technicalContactNamePlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.email',
              title: m.technicalContactEmail,
              variant: 'email',
              placeholder: m.technicalContactEmailPlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              title: m.technicalContactPhoneNumber,
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
      title: m.helpDeskSection,
      children: [
        buildMultiField({
          id: 'helpDesk',
          title: m.helpDeskTitle,
          description: m.helpDeskSubTitle,
          children: [
            buildTextField({
              id: 'helpDesk.email',
              title: m.helpDeskEmail,
              variant: 'email',
              placeholder: m.helpDeskEmailPlaceholder,
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              title: m.helpDeskPhoneNumber,
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
      title: m.confirmationSection,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: m.confirmationTitle,
          description: m.confirmationSubTitle,
          children: [
            buildTitleField({
              title: m.applicantSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.applicantNationalId,
              format: '######-####',
              placeholder: m.applicantNationalIdPlaceholder,
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.applicantName,
              placeholder: m.applicantNamePlaceholder,
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.applicantEmail,
              variant: 'email',
              placeholder: m.applicantEmailPlaceholder,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.applicantPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.applicantPhoneNumberPlaceholder,
            }),
            buildTitleField({
              title: m.administrativeContactSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'administrativeContact.name',
              title: m.administrativeContactName,
              placeholder: m.administrativeContactNamePlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              title: m.administrativeContactEmail,
              variant: 'email',
              placeholder: m.administrativeContactEmailPlaceholder,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              title: m.administrativeContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.administrativeContactPhoneNumberPlaceholder,
            }),
            buildTitleField({
              title: m.technicalContactSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'technicalContact.name',
              title: m.technicalContactName,
              placeholder: m.technicalContactNamePlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.email',
              title: m.technicalContactEmail,
              variant: 'email',
              placeholder: m.technicalContactEmailPlaceHolder,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              title: m.technicalContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.technicalContactPhoneNumberPlaceHolder,
            }),
            buildTitleField({
              title: m.helpDeskSection,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              title: m.helpDeskPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: m.helpDeskPhoneNumberPlaceholder,
            }),
            buildTextField({
              id: 'helpDesk.email',
              title: m.helpDeskEmail,
              variant: 'email',
              placeholder: m.helpDeskEmailPlaceholder,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirmationSubmitButton,

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
      ],
    }),
  ],
})
