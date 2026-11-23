import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  application,
  employmentHistory as m,
  sections,
} from '../../lib/messages'
import {
  COMMENT_ANSWER,
  COMMENT_MAX_LENGTH,
  INCLUDE_UNION_ANSWER,
  INSTITUTION_IDS_ANSWER,
  PREVIEW_VERSION_ANSWER,
  YES,
} from '../../utils/constants'

export const employmentHistorySection = buildSection({
  id: 'employmentHistorySection',
  title: sections.employmentHistory,
  children: [
    buildMultiField({
      id: 'employmentHistory',
      title: m.title,
      description: m.description,
      children: [
        buildCustomField({
          id: 'employmentHistoryTable',
          component: 'EmploymentHistory',
          childInputIds: [PREVIEW_VERSION_ANSWER, INSTITUTION_IDS_ANSWER],
        }),
        buildCheckboxField({
          id: INCLUDE_UNION_ANSWER,
          large: true,
          backgroundColor: 'white',
          marginTop: 4,
          options: [
            {
              value: YES,
              label: m.includeUnionLabel,
              subLabel: m.includeUnionSubLabel,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'employmentHistorySupport',
          alertType: 'info',
          title: m.supportTitle,
          message: m.supportMessage,
          marginTop: 4,
        }),
        buildTextField({
          id: COMMENT_ANSWER,
          title: m.commentLabel,
          placeholder: m.commentPlaceholder,
          variant: 'textarea',
          rows: 4,
          maxLength: COMMENT_MAX_LENGTH,
          showMaxLength: true,
          marginTop: 4,
        }),
        buildDescriptionField({
          id: 'commentHint',
          description: m.commentHint,
          marginTop: 1,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: application.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
