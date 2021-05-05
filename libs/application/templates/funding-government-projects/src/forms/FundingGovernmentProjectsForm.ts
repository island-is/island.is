import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildMultiField,
  buildCustomField,
  buildTextField,
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
        buildDescriptionField({
          id: 'placeholderId1',
          title: definitionOfApplicant.general.pageTitle,
          description: 'Umsókn',
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
        buildMultiField({
          id: 'projectMultiField',
          title: project.general.pageTitle,
          description: project.general.pageDescription,
          children: [
            buildCustomField({
              id: 'projectInfoTitleField',
              title: project.labels.projectInfoFieldTitle,
              component: 'FieldTitle',
            }),
            buildTextField({
              id: 'project.title',
              title: project.labels.projectTitle,
              backgroundColor: 'blue',
              placeholder: project.labels.projectTitlePlaceholder,
              required: true,
            }),
            buildTextField({
              id: 'project.description',
              title: project.labels.projectDescription,
              backgroundColor: 'blue',
              placeholder: project.labels.projectDescriptionPlaceholder,
              required: true,
              variant: 'textarea',
              rows: 4,
            }),
            buildTextField({
              id: 'project.cost',
              title: project.labels.projectCost,
              backgroundColor: 'blue',
              placeholder: project.labels.projectCostPlaceholder,
              required: true,
            }),
            buildCustomField({
              id: 'project.refundableYears',
              title: project.labels.projectYears,
              component: 'YearSlider',
            }),
          ],
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
