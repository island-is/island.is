import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSubmitField,
  buildCheckboxField,
  buildCompanySearchField,
  getValueViaPath,
  buildDescriptionField,
  buildLinkField,
  YES,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  DefaultEvents,
  Application,
} from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import {
  section,
  application,
  terms,
  applicant,
  technicalAnnouncements,
  overview,
  submitted,
  selectCompany,
} from '../lib/messages'

export const LoginServiceForm: Form = buildForm({
  id: 'LoginServiceForm',
  title: application.name,
  mode: FormModes.DRAFT,
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
            buildLinkField({
              id: 'termsOfAgreementLink',
              title: terms.labels.termsAgreementLinkTitle,
              link: terms.values.termsAgreementUrl,
              iconProps: { icon: 'open' },
            }),
            buildCheckboxField({
              id: 'termsOfAgreement',
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
      id: 'selectCompany',
      title: section.selectCompany,
      children: [
        buildMultiField({
          id: 'selectCompanyMultiField',
          title: selectCompany.general.pageTitle,
          description: selectCompany.general.pageDescription,
          children: [
            buildDescriptionField({
              id: 'selectCompany.nameFieldTitle',
              title: selectCompany.labels.nameDescription,
              titleVariant: 'h5',
            }),
            buildCompanySearchField({
              id: 'selectCompany.searchField',
              title: selectCompany.labels.nameAndNationalId,
              shouldIncludeIsatNumber: true,
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
            buildDescriptionField({
              id: 'applicant.nameFieldTitle',
              title: applicant.labels.nameDescription,
              titleVariant: 'h5',
            }),
            buildTextField({
              id: 'applicant.name',
              title: applicant.labels.name,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.label',
                  '',
                )
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicant.labels.nationalId,
              backgroundColor: 'blue',
              width: 'half',
              format: '######-####',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.nationalId',
                  '',
                )
              },
            }),
            buildTextField({
              id: 'applicant.typeOfOperation',
              title: applicant.labels.typeOfOperation,
              backgroundColor: 'blue',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.isat',
                  '',
                )
              },
            }),
            buildDescriptionField({
              id: 'applicant.responsibleParty',
              title: applicant.labels.responsiblePartyTitle,
              titleVariant: 'h5',
              description: applicant.labels.responsiblePartyDescription,
              marginTop: [3, 5],
            }),
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
    buildFormConclusionSection({
      alertTitle: submitted.general.pageTitle,
      expandableHeader: submitted.general.expandableTitle,
      expandableDescription: submitted.labels.desceriptionBulletPoints,
    }),
  ],
})
