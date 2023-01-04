import {
  buildForm,
  buildSection,
  buildCustomField,
  buildTextField,
  buildMultiField,
  buildFileUploadField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
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
  mode: FormModes.DRAFT,
  logo: Logo,
  children: [
    buildSection({
      id: 'informationAboutInstitution',
      title: section.informationAboutInstitution,
      children: [
        buildCustomField({
          id: 'definitionOfApplicantField',
          title: definitionOfApplicant.general.pageTitle,
          component: 'DefinitionOfApplicant',
        }),
        buildMultiField({
          id: 'informationAboutInstitutionMultiField',
          title:
            informationAboutInstitution.general.infoInstitutionMultiFieldTitle,
          description:
            informationAboutInstitution.general
              .infoInstitutionMultiFieldDescription,
          children: [
            buildCustomField({
              id: 'projectInfoTitleField',
              title:
                informationAboutInstitution.general
                  .infoInstitutionTextFieldDescription.defaultMessage,
              component: 'FieldTitle',
            }),
            buildTextField({
              id: 'organizationOrInstitutionName',
              title:
                informationAboutInstitution.general
                  .infoInstitutionTextFieldTitle,
              backgroundColor: 'blue',
              width: 'full',
              required: true,
            }),
            buildCustomField({
              id: 'contacts',
              title: informationAboutInstitution.general.pageTitle,
              description: informationAboutInstitution.general.pageTitle,
              component: 'ContactRepeater',
            }),
          ],
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
