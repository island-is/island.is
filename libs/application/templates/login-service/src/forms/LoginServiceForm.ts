import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildCheckboxField,
  buildSubmitField,
  DefaultEvents,
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
import { TYPE_OF_OPERATION } from '../shared/constants'

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
              format: '######-####',
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildSelectField({
              id: 'applicant.typeOfOperation',
              title: applicant.labels.typeOfOperation,
              backgroundColor: 'blue',
              options: TYPE_OF_OPERATION.map((value) => ({
                label: value,
                value: value,
              })),
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
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'technicalContact.email',
              title: technicalContact.labels.email,
              variant: 'email',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              title: technicalContact.labels.tel,
              variant: 'tel',
              backgroundColor: 'blue',
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
            buildCustomField(
              {
                id: 'technicalContact.techAnnouncementsEmailTitle',
                title: technicalContact.labels.techAnnouncementsEmailTitle,
                component: 'FieldTitle',
              },
              {
                marginTop: [3, 5],
              },
            ),
            buildTextField({
              id: 'technicalContact.techAnnouncementsEmail',
              title: technicalContact.labels.techAnnouncementsEmail,
              description:
                technicalContact.labels.techAnnouncementsEmailDescription,
              variant: 'email',
              backgroundColor: 'blue',
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
        buildMultiField({
          id: 'technicalInfoMultiField',
          title: section.technicalInfo,
          children: [
            buildTextField({
              id: 'technicalInfo.type',
              title: technicalInfo.labels.type,
              description: technicalInfo.labels.typeDescription,
              placeholder: technicalInfo.labels.typePlaceholder,
              variant: 'textarea',
              rows: 4,
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'technicalInfo.devReturnUrl',
              title: technicalInfo.labels.devReturnUrl,
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'technicalInfo.stagingReturnUrl',
              title: technicalInfo.labels.stagingReturnUrl,
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'technicalInfo.prodReturnUrl',
              title: technicalInfo.labels.prodReturnUrl,
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
