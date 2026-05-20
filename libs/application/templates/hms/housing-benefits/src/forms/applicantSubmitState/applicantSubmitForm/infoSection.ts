import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'
import { FormValue } from '@island.is/application/types'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'
import {
  applicantSubmitApprovedAssigneesDescription,
  applicantSubmitRejectedAssigneesDescription,
  applicantSubmitRejectedInfoMessages,
} from '../../../utils/applicantSubmitInfoUtils'

const hasRejectedAssigneesInAnswers = (answers: FormValue): boolean =>
  (getValueViaPath<string[]>(answers, 'rejectedAssignees') ?? []).length > 0

export const infoSection = buildSection({
  id: 'applicantSubmitInfoSection',
  title: asm.infoSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitInfoMultiField',
      title: asm.infoTitle,
      children: [
        buildAlertMessageField({
          id: 'applicantSubmitInfoAlert',
          title: asm.infoAlertTitle,
          message: asm.infoAlertMessage,
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
          description: asm.infoDescription,
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
