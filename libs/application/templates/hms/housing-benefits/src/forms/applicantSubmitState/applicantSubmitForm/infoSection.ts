import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'
import * as m from '../../../lib/messages'
import {
  applicantSubmitApprovedAssigneesDescription,
  applicantSubmitRejectedAssigneesDescription,
  applicantSubmitRejectedInfoMessages,
} from '../../../utils/applicantSubmitInfoUtils'
import { hasRejectedAssigneesInAnswers } from '../../../utils/assigneeRejectionUtils'

export const infoSection = buildSection({
  id: 'applicantSubmitInfoSection',
  title: m.applicantSubmitMessages.infoSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitInfoMultiField',
      title: m.applicantSubmitMessages.infoTitle,
      children: [
        buildAlertMessageField({
          id: 'applicantSubmitInfoAlert',
          title: m.applicantSubmitMessages.infoAlertTitle,
          message: m.applicantSubmitMessages.infoAlertMessage,
          alertType: 'success',
          condition: (answers) => !hasRejectedAssigneesInAnswers(answers),
          marginBottom: 4,
        }),
        buildAlertMessageField({
          id: 'applicantSubmitInfoRejectedAlert',
          title: applicantSubmitRejectedInfoMessages.infoRejectedAlertTitle,
          message: applicantSubmitRejectedInfoMessages.infoRejectedAlertMessage,
          alertType: 'warning',
          condition: (answers) => hasRejectedAssigneesInAnswers(answers),
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'applicantSubmitInfoApprovedAssignees',
          description: applicantSubmitApprovedAssigneesDescription,
          condition: (answers) => hasRejectedAssigneesInAnswers(answers),
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'applicantSubmitInfoRejectedAssignees',
          description: applicantSubmitRejectedAssigneesDescription,
          condition: (answers) => hasRejectedAssigneesInAnswers(answers),
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'applicantSubmitInfoDescription',
          description: m.applicantSubmitMessages.infoDescription,
          marginBottom: 8,
        }),
        buildImageField({
          id: 'applicantSubmitInfoImage',
          image: HandShake,
          marginBottom: 4,
        }),
      ],
    }),
  ],
})
