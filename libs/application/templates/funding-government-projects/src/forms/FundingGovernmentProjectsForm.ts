import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildMultiField,
  buildCustomField,
  buildTextField,
  buildFileUploadField,
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

const FILE_SIZE_LIMIT = 10000000

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
              title: project.labels.infoFieldTitle,
              component: 'FieldTitle',
            }),
            buildTextField({
              id: 'project.title',
              title: project.labels.title,
              backgroundColor: 'blue',
              placeholder: project.labels.titlePlaceholder,
              required: true,
            }),
            buildTextField({
              id: 'project.description',
              title: project.labels.description,
              backgroundColor: 'blue',
              placeholder: project.labels.descriptionPlaceholder,
              required: true,
              variant: 'textarea',
              rows: 4,
            }),
            buildTextField({
              id: 'project.cost',
              title: project.labels.cost,
              backgroundColor: 'blue',
              placeholder: project.labels.costPlaceholder,
              required: true,
            }),
            buildCustomField({
              id: 'project.refundableYears',
              title: project.labels.years,
              component: 'YearSlider',
            }),
            buildCustomField(
              {
                id: 'projectAttachmentsTitle',
                title: project.labels.attachmentsTitle,
                description: project.labels.attachmentsIntro,
                component: 'FieldTitle',
              },
              {
                required: true,
              },
            ),
            buildFileUploadField({
              id: 'project.attachments',
              title: '',
              introduction: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadHeader: project.labels.attachmentsUploadHeader,
              uploadDescription: project.labels.attachmentsUploadDescription,
              uploadButtonLabel: project.labels.attachmentsUploadButtonLabel,
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
