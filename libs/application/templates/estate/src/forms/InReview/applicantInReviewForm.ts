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
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { EstateTypes, YES } from '../../lib/constants'
import { EstateMember } from '../../types'
import { allPartiesHaveApproved } from '../../lib/utils/allPartiesHaveApproved'

const NEXT_STEP_TO_SIGNING = 'goToSigning'
const NEXT_STEP_TO_EDIT = 'editApplication'

const isPaymentEnabled = (externalData: Record<string, unknown>): boolean => {
  const paymentData = getValueViaPath(externalData, 'payment.data')
  return Array.isArray(paymentData) && paymentData.length > 0
}

const requiresEstatePayment = (
  answers: Record<string, unknown>,
  externalData: Record<string, unknown>,
) => {
  const selectedEstate = getValueViaPath<string>(answers, 'selectedEstate')
  const supportsPayment =
    selectedEstate === EstateTypes.divisionOfEstateByHeirs ||
    selectedEstate === EstateTypes.permitForUndividedEstate
  // Only route to payment when the payment feature is actually enabled
  // (the payment data provider is only added when ALLOW_ESTATE_PAYMENT is on).
  // Otherwise paid estate types fall back to the direct submit/signing path.
  return supportsPayment && isPaymentEnabled(externalData)
}

export const applicantInReviewForm: Form = buildForm({
  id: 'applicantInReviewForm',
  title: m.inReviewGeneralTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'applicantReview',
      title: m.applicantInReviewTitle,
      children: [
        // Screen 1 - review status of estate members and choice of next step
        buildMultiField({
          id: 'applicantReview.partyStatus',
          title: m.applicantInReviewTitle,
          description: m.applicantInReviewDescription,
          children: [
            buildStaticTableField({
              title: m.applicantInReviewTableTitle,
              marginTop: 3,
              header: [
                m.inReviewNameLabel,
                m.inReviewNationalIdLabel,
                m.applicantInReviewStatusLabel,
              ],
              rows: (application) => {
                const estateMembers = getValueViaPath<EstateMember[]>(
                  application.answers,
                  'estate.estateMembers',
                  [],
                )

                return (
                  estateMembers
                    ?.filter((member) => member.enabled !== false)
                    .map((member) => [
                      member.name || '',
                      formatNationalId(member.nationalId || ''),
                      member.approved
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
            // When "continue" is selected the default footer button advances to
            // the pre-signature screen instead.
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
        // Screen 2 - acknowledgement before sending to syslumenn
        buildMultiField({
          id: 'applicantReview.preSignature',
          title: m.applicantInReviewPreSignatureTitle,
          children: [
            buildDescriptionField({
              id: 'applicantReview.directWarning',
              description: m.applicantInReviewDirectWarning,
              condition: (answers) =>
                !allPartiesHaveApproved(answers, 'estate.estateMembers'),
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
                  condition: (answers, externalData) =>
                    !requiresEstatePayment(answers, externalData) &&
                    !allPartiesHaveApproved(answers, 'estate.estateMembers'),
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.applicantInReviewSubmit.defaultMessage,
                  type: 'sign',
                  condition: (answers, externalData) =>
                    !requiresEstatePayment(answers, externalData) &&
                    allPartiesHaveApproved(answers, 'estate.estateMembers'),
                },
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.applicantInReviewSubmitDirect.defaultMessage,
                  type: 'primary',
                  condition: (answers, externalData) =>
                    requiresEstatePayment(answers, externalData) &&
                    !allPartiesHaveApproved(answers, 'estate.estateMembers'),
                },
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.applicantInReviewSubmit.defaultMessage,
                  type: 'primary',
                  condition: (answers, externalData) =>
                    requiresEstatePayment(answers, externalData) &&
                    allPartiesHaveApproved(answers, 'estate.estateMembers'),
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
