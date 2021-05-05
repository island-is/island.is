import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildCustomField,
  buildTextField,
  buildMultiField,
  DefaultEvents,
  buildSubmitField,
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
      id: 'definitionOfApplicant',
      title: section.definitionOfApplicant,
      children: [
        buildCustomField({
          id: 'definitionOfApplicantField',
          title: definitionOfApplicant.general.pageTitle,
          component: 'DefinitionOfApplicant',
        }),
      ],
    }),
    buildSection({
      id: 'informationAboutInstitution',
      title: section.informationAboutInstitution,
      children: [
        buildMultiField({
          id: 'informationAboutInstitutionMultiField',
          title:
            informationAboutInstitution.general.infoInstitutionMultiFieldTitle,
          description:
            informationAboutInstitution.general
              .infoInstitutionMultiFieldDescription,
          children: [
            buildCustomField(
              {
                id: 'organizationOrInstitutionName.description',
                component: 'FieldDescription',
                title: '',
              },
              {
                description:
                  informationAboutInstitution.general
                    .infoInstitutionTextFieldDescription.defaultMessage,
              },
            ),
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
        buildMultiField({
          id: 'overviewMultifield',
          title: overview.general.pageTitle,
          description: overview.general.pageTitle.description,
          children: [
            buildCustomField({
              id: 'overviewCustomField',
              title: overview.general.pageTitle,
              description: overview.general.pageTitle.description,
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
