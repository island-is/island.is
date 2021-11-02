import { buildForm, Form } from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { inReview } from '../../lib/messages'
import { addAttachmentsSection } from './addAttachmentsSection'
import { applicationStatusSection } from './applicationStatusSection'
import { inReviewOverviewSection } from './inReviewOverviewSection'

export const ApplicantReview: Form = buildForm({
  id: 'applicantReviewForm',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    applicationStatusSection,
    addAttachmentsSection,
    inReviewOverviewSection(),
  ],
})
export const AssigneeReview: Form = buildForm({
  id: 'assigneeReviewForm',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    applicationStatusSection,
    addAttachmentsSection,
    inReviewOverviewSection(true),
  ],
})
