import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Form, FormModes, YES } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages/messages'

export const MissingInfoForm: Form = buildForm({
  id: 'HealthInsuranceReview',
  title: m.formTitle,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'missingInfoSection',
      title: m.missingInfoSection,
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          title: m.missingInfoSection,
          description: '',
          children: [
            buildDescriptionField({
              id: 'description',
              title: m.agentCommentsTitle,
              titleVariant: 'h4',
              description: (application: Application) =>
                getValueViaPath<string>(application.answers, 'agentComments') ??
                m.agentCommentsEmpty,
            }),
            buildDividerField({
              title: m.missingInfoAnswersTitle,
              color: 'dark400',
            }),
            buildCustomField({
              id: 'missingInfo.date',
              title: '',
              component: 'HiddenDateField',
            }),
            buildCustomField({
              id: 'missingInfo.remarks',
              title: '',
              component: 'MissingInfoRemarks',
            }),
            buildFileUploadField({
              id: 'missingInfo[0].files',
              title: '',
              introduction: '',
            }),
            buildDividerField({
              title: m.previousAnswersTitle,
              color: 'dark400',
            }),
            buildCustomField({
              id: 'submittedData',
              title: '',
              component: 'Review',
            }),
            buildCheckboxField({
              id: 'confirmMissingInfo',
              title: '',
              options: [
                {
                  value: YES,
                  label: m.confirmCorrectInfo,
                },
              ],
            }),
            buildSubmitField({
              id: 'submit',
              title: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'REJECT', name: 'Back to inReview', type: 'subtle' },
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }),
  ],
})
