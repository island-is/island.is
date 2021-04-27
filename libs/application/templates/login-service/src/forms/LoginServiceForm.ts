import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
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
        buildDescriptionField({
          id: 'placeholderDescription',
          title: terms.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: section.applicant,
      children: [
        buildDescriptionField({
          id: 'placeholderDescription2',
          title: applicant.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'technicalContact',
      title: section.technicalContact,
      children: [
        buildDescriptionField({
          id: 'placeholderDescription3',
          title: technicalContact.general.pageTitle,
          description: 'Umsókn',
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
