import {
  buildCheckboxField,
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { FILE_SIZE_LIMIT, YES } from '../../utils/constants'
import { Comparators } from '@island.is/application/types'
import { getYesNoOptions } from '../../utils/options'

export const confirmSection = buildSection({
  id: 'confirm',
  title: m.confirmationSection,
  children: [
    buildMultiField({
      id: '',
      title: m.confirmationTitle,
      children: [
        buildCustomField({
          id: 'review',
          title: '',
          component: 'Review',
        }),
        buildRadioField({
          id: 'hasAdditionalInfo',
          title: '',
          description: m.additionalInfo,
          largeButtons: true,
          width: 'half',
          options: getYesNoOptions({}),
        }),
        buildTextField({
          id: 'additionalRemarks',
          title: m.additionalRemarks,
          variant: 'textarea',
          rows: 4,
          placeholder: m.additionalRemarksPlaceholder,
          backgroundColor: 'blue',
          condition: {
            questionId: 'hasAdditionalInfo',
            comparator: Comparators.EQUALS,
            value: YES,
          },
        }),
        buildFileUploadField({
          id: 'additionalFiles',
          title: '',
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: m.fileUploadHeader,
          uploadDescription: m.fileUploadDescription,
          uploadButtonLabel: m.fileUploadButton,
          condition: {
            questionId: 'hasAdditionalInfo',
            comparator: Comparators.EQUALS,
            value: YES,
          },
        }),
        buildDividerField({
          title: ' ',
          color: 'transparent',
          condition: {
            questionId: 'hasAdditionalInfo',
            comparator: Comparators.EQUALS,
            value: YES,
          },
        }),
        buildCheckboxField({
          id: 'confirmCorrectInfo',
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
          actions: [{ event: 'SUBMIT', name: m.submitLabel, type: 'primary' }],
        }),
      ],
    }),
  ],
})
