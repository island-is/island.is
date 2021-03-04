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
import { institutionApplicationMessages as m } from '../lib/messages'
import { YES } from '../constants'

export const application: Form = buildForm({
  id: 'InstitutionApplicationDraftForm',
  title: m.applicant.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantSection',
      title: m.applicant.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicantInformation',
          title: m.applicant.sectionTitle,
          description: m.applicant.sectionDescription,
          children: [
            buildCustomField(
              {
                id: 'applicant.institutionSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.institutionSubtitle,
              },
            ),
            buildTextField({
              id: 'applicant.institution',
              title: m.applicant.institutionLabel,
              backgroundColor: 'blue',
            }),
            buildCustomField(
              {
                id: 'applicant.contactSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.contactSubtitle,
              },
            ),
            buildTextField({
              id: 'contact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'contact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'contact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'blue',
            }),
            buildCustomField({
              id: 'secondaryContact',
              title: m.applicant.secondaryContactSubtitle,
              component: 'SecondaryContact',
            }),
            buildTextField({
              id: 'secondaryContact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'blue',
              condition: (formvalue) => formvalue.hasSecondaryContact === YES,
            }),
            buildTextField({
              id: 'secondaryContact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
              condition: (formvalue) => formvalue.hasSecondaryContact === YES,
            }),
            buildTextField({
              id: 'secondaryContact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'blue',
              condition: (formvalue) => formvalue.hasSecondaryContact === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'projectSection',
      title: m.project.sectionLabel,
      children: [
        buildSubSection({
          id: 'projectInfoSubesction',
          title: m.project.subSectionLabel,
          children: [
            buildMultiField({
              id: 'project',
              title: m.project.sectionTitle,
              description: m.project.sectionDescription,
              children: [
                buildCustomField(
                  {
                    id: 'project.informationSubtitle',
                    component: 'FieldDescription',
                    title: '',
                  },
                  {
                    subTitle: m.project.informationSubtitle,
                  },
                ),
                buildTextField({
                  id: 'project.name',
                  title: m.project.nameLabel,
                  variant: 'text',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'project.background',
                  title: m.project.backgroundLabel,
                  placeholder: m.project.backgroundPlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'project.goals',
                  title: m.project.goalsLabel,
                  placeholder: m.project.goalsPlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'project.scope',
                  title: m.project.scopeLabel,
                  placeholder: m.project.scopePlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'project.finance',
                  title: m.project.financeLabel,
                  placeholder: m.project.financePlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
                buildCustomField(
                  {
                    id: 'attatchments.description',
                    component: 'FieldDescription',
                    title: '',
                  },
                  {
                    subTitle: m.project.attatchmentsSubtitle,
                    description: m.project.attatchmentsDescription,
                  },
                ),
                buildFileUploadField({
                  id: 'attatchments',
                  title: '',
                  introduction: '',
                  uploadHeader: 'Dragðu skjöl hingað til að hlaða upp',
                  uploadDescription:
                    'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
                  uploadButtonLabel: 'Velja skjöl til að hlaða upp',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'projectConstraintsSection',
          title: m.constraints.subSectionLabel,
          children: [
            buildMultiField({
              id: 'constraints',
              title: m.constraints.sectionTitle,
              description: m.constraints.sectionDescription,
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
          title: m.stakeholders.subSectionLabel,
          children: [
            buildMultiField({
              id: 'stakeholders',
              title: m.stakeholders.sectionTitle,
              description: '',
              children: [
                buildTextField({
                  id: 'stakeholders',
                  title: m.stakeholders.stakeholdersLabel,
                  placeholder: m.stakeholders.stakeholdersPlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'role',
                  title: m.stakeholders.roleLabel,
                  placeholder: m.stakeholders.rolePlaceholder,
                  variant: 'textarea',
                  backgroundColor: 'blue',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicationReview',
      title: m.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReview',
          title: m.review.sectionTitle,
          description: m.review.sectionDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.review.submitButtonLabel,
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
      title: m.confirmation.sectionLabel,
      children: [
        buildCustomField({
          id: 'successfulSubmission',
          title: 'Takk fyrir umsóknina!',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
