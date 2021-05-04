import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildCustomField,
  buildTextField,
  buildMultiField,
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
      id: 'informationAboutInstitution',
      title: section.informationAboutInstitution,
      children: [
        buildMultiField({
          id: 'informationAboutInstitutionMultiField',
          title: 'Upplýsingar um stofnun',
          description:
            'Upplýsingar um þá A-Hluta stofnun sem sækir um fjármögnun á verkefni til hagræðingar.',
          children: [
            buildTextField({
              id: 'informationAboutInstitutionTextField',
              title: 'Nafn á ráðuneyti eða stofnun',
              description:
                'Hvaða ráðuneyti eða stofnun sækir sækir um fjármögnun?',
              backgroundColor: 'blue',
              width: 'full',
              required: true,
            }),
            buildCustomField({
              id: 'contactRepeaterCustomField',
              title: informationAboutInstitution.general.pageTitle,
              description: informationAboutInstitution.general.pageTitle,
              component: 'ContactRepeater',
            }),
          ],
        }),
      ],
    }),
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
