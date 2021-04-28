import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildCheckboxField,
} from '@island.is/application/core'
import {
  section,
  application,
  terms,
  applicant,
  technicalContact,
  technicalInfo,
  overview,
  submitted,
} from '../lib/messages'

export const LoginServiceForm: Form = buildForm({
  id: 'LoginServiceForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'terms',
      title: section.terms,
      children: [
        buildCustomField({
          id: 'termsAgreement',
          title: terms.general.pageTitle,
          component: 'TermsOfAgreement',
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: section.applicant,
      children: [
        buildMultiField({
          id: 'applicantMultiField',
          title: applicant.general.pageTitle,
          description: applicant.general.pageDescription,
          children: [
            buildCustomField({
              id: 'applicant.nameFieldTitle',
              title: applicant.labels.nameDescription,
              component: 'FieldTitle',
            }),
            buildTextField({
              id: 'applicant.name',
              title: applicant.labels.name,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicant.labels.nationalId,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildSelectField({
              id: 'applicant.typeOfOperation',
              title: applicant.labels.typeOfOperation,
              backgroundColor: 'blue',
              options: [
                { label: 'Einn', value: 'Einn' },
                { label: 'Tveir', value: 'Tveir' },
              ],
            }),
            buildCustomField(
              {
                id: 'applicant.responsibleParty',
                title: applicant.labels.responsiblePartyTitle,
                description: applicant.labels.responsiblePartyDescription,
                component: 'FieldTitle',
              },
              {
                marginTop: [3, 5],
              },
            ),
            buildTextField({
              id: 'applicant.responsiblePartyName',
              title: applicant.labels.responsiblePartyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'applicant.responsiblePartyEmail',
              title: applicant.labels.responsiblePartyEmail,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'applicant.responsiblePartyTel',
              title: applicant.labels.responsiblePartyTel,
              backgroundColor: 'blue',
              format: '###-####',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'technicalContact',
      title: section.technicalContact,
      children: [
        buildMultiField({
          id: 'technicalContactMultiField',
          title: technicalContact.general.pageTitle,
          description: technicalContact.general.pageDescription,
          children: [
            buildTextField({
              id: 'technicalContact.name',
              title: technicalContact.labels.name,
            }),
            buildTextField({
              id: 'technicalContact.email',
              title: technicalContact.labels.email,
              variant: 'email',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              title: technicalContact.labels.tel,
              variant: 'tel',
              format: '###-####',
            }),
            buildCheckboxField({
              id: 'technicalContact.sameAsResponsibleParty',
              title: '',
              options: [
                {
                  label: technicalContact.labels.sameAsResponsibleParty,
                  value: 'yes',
                },
              ],
            }),
            buildTextField({
              id: 'technicalContact.techAnnouncementsEmail',
              title: technicalContact.labels.techAnnouncementsEmail,
              description:
                technicalContact.labels.techAnnouncementsEmailDescription,
              variant: 'email',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'technicalInfo',
      title: section.technicalInfo,
      children: [
        buildDescriptionField({
          id: 'placeholderDescription4',
          title: technicalInfo.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildDescriptionField({
          id: 'placeholderDescription5',
          title: overview.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: section.submitted,
      children: [
        buildDescriptionField({
          id: 'placeholderDescription6',
          title: submitted.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
