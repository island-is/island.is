import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { States } from '../constants'
import { inReview } from '../lib/messages'

export const AssigneeInReview: Form = buildForm({
  id: 'AssigneeInReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: (application) =>
        application.state === States.APPROVED
          ? inReview.general.titleApproved
          : inReview.general.titleInReview,
      children: [
        buildCustomField(
          {
            id: 'InReviewSteps.one',
            title: (application) =>
              application.state === States.APPROVED
                ? inReview.general.titleApproved
                : inReview.general.titleInReview,
            component: 'InReviewSteps',
          },
          {
            isAssignee: true,
          },
        ),
      ],
    }),
  ],
})
