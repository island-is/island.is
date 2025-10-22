import {
  buildForm,
  buildSection,
  buildCustomField,
  buildTextField,
  buildMultiField,
  buildFileUploadField,
  buildSubmitField,
  buildSliderField,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { MinistryOfFinanceAndLocalAffairsLogo } from '@island.is/application/assets/institution-logos'
import {
  section,
  application,
  definitionOfApplicant,
  project,
  overview,
  submitted,
  informationAboutInstitution,
  shared,
} from '../lib/messages'
import { theme } from '@island.is/island-ui/theme'
import { Application } from '@island.is/api/schema'

const FILE_SIZE_LIMIT = 10000000

export const FundingGovernmentProjectsForm: Form = buildForm({
  id: 'FundingGovernmentProjectsForm',
  title: application.name,
  mode: FormModes.DRAFT,
  logo: MinistryOfFinanceAndLocalAffairsLogo,
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
            buildDescriptionField({
              id: 'refundableYearsDescription',
              title: project.labels.years,
              titleVariant: 'h4',
              marginTop: 6,
              marginBottom: 4,
            }),
            buildSliderField({
              id: 'project.refundableYears',
              label: {
                singular: shared.yearSingular,
                plural: shared.yearPlural,
              },
              min: 5,
              max: 10,
              step: 1,
              defaultValue: (application: Application) =>
                getValueViaPath(
                  application.answers,
                  'project.refundableYears',
                  5,
                ),
              showMinMaxLabels: true,
              showToolTip: true,
              trackStyle: { gridTemplateRows: 5 },
              calculateCellStyle: () => {
                return {
                  background: theme.color.dark200,
                }
              },
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
      alertTitle: submitted.general.alertTitle,
      expandableHeader: submitted.labels.title,
      expandableIntro: submitted.labels.intro,
      expandableDescription: submitted.labels.bulletList,
    }),
  ],
})
