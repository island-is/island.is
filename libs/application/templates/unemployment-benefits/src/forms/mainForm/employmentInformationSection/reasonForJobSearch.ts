import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const reasonForJobSearchSubSection = buildSubSection({
  id: 'reasonForJobSearchSubSection',
  title: employmentMessages.reasonForJobSearch.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reasonForJobSearchSubSection',
      title: employmentMessages.reasonForJobSearch.general.pageTitle,
      children: [
        // TODO: add all of this into answers when we know how it's supposed to be like
        buildDescriptionField({
          id: 'reasonForJobSearch.description',
          title:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchDescription,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'reasonForJobSearch.mainReason',
          title:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchLabel,
          placeholder:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchPlaceholder,
          options: [
            {
              value: 'jobSearch',
              label: 'Bla',
            },
            {
              value: 'other',
              label: 'Bla 2',
            },
          ],
        }),
        buildSelectField({
          id: 'reasonForJobSearch.additionalReason',
          title:
            employmentMessages.reasonForJobSearch.labels
              .furtherExplanationLabel,
          placeholder:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchPlaceholder,
          options: [
            {
              value: 'jobSearch',
              label: 'Bla',
            },
            {
              value: 'other',
              label: 'Bla 2',
            },
          ],
          condition: (_answers) => {
            // TODO: only show if reason for job search requires additional reason
            return true
          },
        }),
        // TODO: add doctors note in file uploader if required by api
        buildDescriptionField({
          id: 'reasonForJobSearch.additionalReasonDescription',
          title:
            employmentMessages.reasonForJobSearch.labels
              .additionalReasonForJobSearchDescription,
          titleVariant: 'h5',
          condition: (_answers) => {
            // TODO: only show if reason for job search requires additional reason
            return true
          },
        }),
        buildTextField({
          id: 'reasonForJobSearch.additionalReasonText',
          title:
            employmentMessages.reasonForJobSearch.labels
              .additionalReasonForJobSearchLabel,
          variant: 'textarea',
          rows: 6,
          condition: (_answers) => {
            // TODO: only show if reason for job search requires additional reason
            return true
          },
        }),
        buildAlertMessageField({
          id: 'reasonForJobSearch.alertMessage',
          message: 'Fá þetta frá þjónustu',
          alertType: 'info',
          condition: (_answers) => {
            // TODO: only show if reason for job search requires additional reason
            return true
          },
        }),
        buildCheckboxField({
          id: 'reasonForJobSearch.checkboxReason',
          options: [
            {
              value: 'jobSearch',
              label: 'Fá frá þjónustu?',
            },
          ],
          condition: (_answers) => {
            // TODO: only show if reason for job search requires additional reason
            return true
          },
        }),
      ],
    }),
  ],
})
