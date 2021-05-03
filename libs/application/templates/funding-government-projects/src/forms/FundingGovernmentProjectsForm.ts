import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import {
  section,
  application,
  definitionOfApplicant,
  project,
  overview,
  submitted,
  informationAboutInstitution,
} from '../lib/messages'

export const FundingGovernmentProjectsForm: Form = buildForm({
  id: 'FundingGovernmentProjectsForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'definitionOfApplicants',
      title: section.definitionOfApplicant,
      children: [
        buildCustomField({
          id: 'placeholderId1',
          title: definitionOfApplicant.general.pageTitle,
          component: 'DefinitionOfApplicant',
        }),
      ],
    }),
    buildSection({
      id: 'informationAboutInstitution',
      title: section.informationAboutInstitution,
      children: [
        buildDescriptionField({
          id: 'placeholderId2',
          title: informationAboutInstitution.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'project',
      title: section.project,
      children: [
        buildDescriptionField({
          id: 'placeholderId3',
          title: project.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildDescriptionField({
          id: 'placeholderId4',
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
          id: 'placeholderId5',
          title: submitted.general.pageTitle,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
