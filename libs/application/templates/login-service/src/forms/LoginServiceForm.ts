import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSubmitField,
  DefaultEvents,
  buildCheckboxField,
} from '@island.is/application/core'
import {
  section,
  application,
  terms,
  applicant,
  technicalAnnouncements,
  overview,
  submitted,
} from '../lib/messages'
import { YES } from '../shared/constants'

export const LoginServiceForm: Form = buildForm({
  id: 'LoginServiceForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'terms',
      title: section.terms,
      children: [
        buildMultiField({
          id: 'termsOfAgreementMultiField',
          title: terms.general.pageTitle,
          description: terms.general.pageDescription,
          children: [
            buildCustomField({
              id: 'termsAgreement',
              title: terms.general.pageTitle,
              doesNotRequireAnswer: true,
              component: 'TermsOfAgreement',
            }),
            buildCheckboxField({
              id: 'termsOfAgreement',
              title: '',
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: terms.labels.termsAgreementApproval,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantSection',
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
              doesNotRequireAnswer: true,
              component: 'FieldTitle',
            }),
            buildCustomField({
              id: 'applicant',
              title: '',
              component: 'InformationAboutApplication',
            }),
            buildCustomField(
              {
                id: 'applicant.responsibleParty',
                title: applicant.labels.responsiblePartyTitle,
                description: applicant.labels.responsiblePartyDescription,
                doesNotRequireAnswer: true,
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
          title: technicalAnnouncements.general.pageTitle,
          description: technicalAnnouncements.general.pageDescription,
          children: [
            buildTextField({
              id: 'technicalAnnouncements.email',
              title: technicalAnnouncements.labels.email,
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'technicalAnnouncements.phoneNumber',
              title: technicalAnnouncements.labels.tel,
              variant: 'tel',
              backgroundColor: 'blue',
              format: '###-####',
              required: true,
            }),
            buildTextField({
              id: 'technicalAnnouncements.type',
              title: technicalAnnouncements.labels.type,
              placeholder: technicalAnnouncements.labels.typePlaceholder,
              backgroundColor: 'blue',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultifield',
          title: overview.general.pageTitle,
          description: overview.general.pageDescription,
          children: [
            buildCustomField({
              id: 'overviewCustomField',
              title: overview.general.pageTitle,
              description: overview.general.pageDescription,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'overview.submitField',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: section.submitted,
      children: [
        buildCustomField({
          id: 'submittedCustomField',
          title: submitted.general.pageTitle,
          component: 'Submitted',
        }),
      ],
    }),
  ],
})
