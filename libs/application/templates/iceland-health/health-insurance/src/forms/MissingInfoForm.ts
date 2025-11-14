import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTitleField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'

export const MissingInfoForm: Form = buildForm({
  id: 'HealthInsuranceReview',
  title: m.formTitle,
  logo: IcelandHealthLogo,
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
            buildTitleField({
              title: m.missingInfoAnswersTitle,
            }),
            buildCustomField({
              id: 'missingInfo.date',
              component: 'HiddenDateField',
            }),
            buildCustomField({
              id: 'missingInfo.remarks',
              component: 'MissingInfoRemarks',
            }),
            buildFileUploadField({
              id: 'missingInfo[0].files',
              introduction: '',
            }),
            buildTitleField({
              title: m.previousAnswersTitle,
            }),
            buildCustomField({
              id: 'submittedData',
              component: 'Review',
            }),
            buildCheckboxField({
              id: 'confirmMissingInfo',
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
