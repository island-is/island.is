import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildStaticTableField,
  buildSubmitField,
  buildDividerField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { EstateMember } from '../../types'
import { allPartiesHaveApproved } from '../../lib/utils/allPartiesHaveApproved'

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
            buildSubmitField({
              id: 'applicantReview.actions',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: m.inReviewActionsBackToEdit.defaultMessage,
                  type: 'subtle',
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.applicantInReviewSubmit.defaultMessage,
                  type: 'primary',
                  condition: (answers) => {
                    return allPartiesHaveApproved(answers)
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
