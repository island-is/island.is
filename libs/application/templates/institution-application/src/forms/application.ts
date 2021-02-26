import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  buildCustomField,
  buildSubmitField,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from './messages'

export const application: Form = buildForm({
  id: 'InstitutionApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantSection',
      title: m.applicantSectionLabel,
      children: [
        buildMultiField({
          id: 'applicantInformation',
          title: m.applicantSectionTitle,
          description: m.applicantSectionDescription,
          children: [
            buildTextField({
              id: 'applicant.institution',
              title: m.applicantInstitutionLabel,
              description: m.applicantInstitutionSubtitle,
            }),
            buildTextField({
              id: 'contact.name',
              title: m.applicantContactName,
              description: m.applicantContactSubtitle,
            }),
            buildTextField({
              id: 'contact.phoneNumber',
              title: m.applicantContactPhone,
              variant: 'tel',
              format: '###-####',
            }),
            buildTextField({
              id: 'contact.email',
              title: m.applicantContactEmail,
              variant: 'email',
            }),
            buildCustomField({
              id: 'secondaryContact',
              title: '',
              component: 'SecondaryContact',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'projectSection',
      title: m.projectSectionLabel,
      children: [
        buildSubSection({
          id: 'projectInfoSubesction',
          title: m.projectInformationSubsectionLabel,
          children: [
            buildMultiField({
              id: 'project',
              title: m.projectSectionTitle,
              description: m.projectSectionDescription,
              children: [
                buildTextField({
                  id: 'project.name',
                  title: m.projectName,
                  description: m.projectInformationSubtitle,
                  variant: 'text',
                }),
                buildTextField({
                  id: 'project.background',
                  title: m.projectBackground,
                  placeholder: m.projectBackgroundPlaceholder,
                  variant: 'textarea',
                }),
                buildTextField({
                  id: 'project.goals',
                  title: m.projectGoals,
                  placeholder: m.projectGoalsPlaceholder,
                  variant: 'textarea',
                }),
                buildTextField({
                  id: 'project.scope',
                  title: m.projectScope,
                  placeholder: m.projectScopePlaceholder,
                  variant: 'textarea',
                }),
                buildTextField({
                  id: 'project.finance',
                  title: m.projectFinance,
                  placeholder: m.projectFinancePlaceholder,
                  variant: 'textarea',
                }),
                buildFileUploadField({
                  id: 'attatchments',
                  title: '',
                  introduction: '',
                  uploadHeader: 'Senda skjal',
                  uploadDescription: 'Senda skjal',
                  uploadButtonLabel: 'Senda skjal',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'projectConstraintsSection',
          title: m.projectRestrictionSubsectionLabel,
          children: [
            buildMultiField({
              id: 'constraints',
              title: 'Skorður verkefnis',
              description: 'Vinsamlegast fylltu ut skordur',
              children: [
                buildCustomField({
                  id: 'constraints',
                  title: '',
                  component: 'Constraints',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'stakholdersSection',
          title: 'Hagsmunaaðillar',
          children: [
            buildMultiField({
              id: 'stakeholders',
              title: 'Hlutverk og hagsmunaaðilar',
              description: '',
              children: [
                buildTextField({
                  id: 'project.stakeholders',
                  title: 'Hagsmunaaðilar',
                  placeholder: 'asnjdnajsdn',
                  variant: 'textarea',
                }),
                buildTextField({
                  id: 'project.role',
                  title: 'Skilgreind hlutverk',
                  placeholder: 'asnjdnajsdn',
                  variant: 'textarea',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicationOverview',
      title: 'Yfirlit umsóknar',
      children: [
        buildMultiField({
          id: 'applicationOverview',
          title: 'Yfirlit og staðfesting umsóknar',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rhoncus, est vel eleifend aliquet, purus nibh pretium risus, eget imperdiet turpis nisi sit amet arcu. In non auctor erat. Quisque at nunc sed nisi elementum blandit id nec nisl. Vestibulum consectetur arcu sed porta congue. Cras vulputate placerat vulputate',
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: 'Staðfesta umsókn',
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'successfulSubmissionSection',
      title: 'Umsókn staðfest',
      children: [
        buildCustomField({
          id: 'successfulSubmission',
          title: '',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
