import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const assigneeInReviewForm: Form = buildForm({
  id: 'assigneeInReviewForm',
  title: m.inReviewGeneralTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'assigneeReview',
      title: m.inReviewGeneralTitle,
      children: [
        buildMultiField({
          id: 'assigneeReview.overview',
          title: m.inReviewGeneralTitle,
          description: m.assigneeInReviewDescription,
          children: [
            buildCustomField({
              id: 'assigneeReview.info',
              title: '',
              component: 'AssigneeCard',
            }),
            buildCustomField({
              id: 'assigneeReview.applicationOverview',
              title: '',
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assigneeReview.actions',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: m.assigneeReviewReject.defaultMessage,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: m.assigneeReviewApprove.defaultMessage,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

