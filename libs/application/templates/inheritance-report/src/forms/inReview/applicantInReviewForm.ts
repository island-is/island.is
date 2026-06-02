import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildStaticTableField,
  buildSubmitField,
  buildDividerField,
  buildRadioField,
  buildCheckboxField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { EstateMember } from '../../types'
import { allPartiesHaveApproved } from '../../lib/utils/allPartiesHaveApproved'

const NEXT_STEP_TO_SIGNING = 'goToSigning'
const NEXT_STEP_TO_EDIT = 'editApplication'

export const applicantInReviewForm: Form = buildForm({
  id: 'applicantInReviewForm',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'applicantReview',
      title: m.applicantInReviewTitle,
      children: [
        // Screen 1 - review status of heirs and choice of next step
        buildMultiField({
          id: 'applicantReview.partyStatus',
          title: m.applicantInReviewTitle,
          description: m.applicantInReviewDescription,
          children: [
            buildStaticTableField({
              title: m.applicantInReviewTableTitle,
              marginTop: 3,
              header: [
                m.inReviewSignatoriesNameLabel,
                m.inReviewSignatoriesNationalIdLabel,
                m.applicantInReviewStatusLabel,
              ],
              rows: (application) => {
                const heirs = getValueViaPath<EstateMember[]>(
                  application.answers,
                  'heirs.data',
                  [],
                )

                return (
                  heirs
                    ?.filter((heir) => heir.enabled !== false)
                    .map((heir) => [
                      heir.name || '',
                      formatNationalId(heir.nationalId || ''),
                      heir.approved
                        ? m.applicantInReviewStatusApproved.defaultMessage
                        : m.applicantInReviewStatusPending.defaultMessage,
                    ]) || []
                )
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'applicantReview.info',
              title: m.applicantInReviewInfoTitle,
              description: m.applicantInReviewInfoDescription,
              titleVariant: 'h3',
              space: 6,
              marginTop: 7,
            }),
            buildRadioField({
              id: 'inReviewNextStep',
              defaultValue: NEXT_STEP_TO_SIGNING,
              marginTop: 4,
              options: [
                {
                  value: NEXT_STEP_TO_SIGNING,
                  label: m.applicantInReviewNextStepToSigning,
                },
                {
                  value: NEXT_STEP_TO_EDIT,
                  label: m.inReviewActionsBackToEdit,
                },
              ],
            }),
            // The EDIT action is only shown when the applicant chooses to edit.
            // When "continue to signing" is selected the default footer button
            // advances to the pre-signature screen instead.
            buildSubmitField({
              id: 'applicantReview.editAction',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: m.inReviewActionsBackToEdit.defaultMessage,
                  type: 'subtle',
                },
              ],
              condition: (answers) =>
                getValueViaPath<string>(answers, 'inReviewNextStep') ===
                NEXT_STEP_TO_EDIT,
            }),
          ],
        }),
        // Screen 2 - acknowledgement before sending to signing
        buildMultiField({
          id: 'applicantReview.preSignature',
          title: m.applicantInReviewPreSignatureTitle,
          children: [
            buildDescriptionField({
              id: 'applicantReview.directWarning',
              description: m.applicantInReviewDirectWarning,
              condition: (answers) => !allPartiesHaveApproved(answers),
            }),
            buildDescriptionField({
              id: 'applicantReview.preSignatureInfo',
              description: m.applicantInReviewPreSignatureInfo,
              marginTop: 2,
            }),
            buildCheckboxField({
              id: 'inReviewSigningConfirmation',
              required: true,
              large: true,
              marginTop: 6,
              options: [
                {
                  value: YES,
                  label: m.applicantInReviewStatementLabel,
                },
              ],
            }),
            buildSubmitField({
              id: 'applicantReview.actions',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.applicantInReviewSubmitDirect.defaultMessage,
                  type: 'sign',
                  condition: (answers) => !allPartiesHaveApproved(answers),
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.applicantInReviewSubmit.defaultMessage,
                  type: 'sign',
                  condition: (answers) => allPartiesHaveApproved(answers),
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
