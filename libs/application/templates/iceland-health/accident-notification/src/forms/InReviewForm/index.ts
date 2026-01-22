import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { inReview } from '../../lib/messages'
import { addAttachmentsSection } from './addAttachmentsSection'
import { applicationStatusSection } from './applicationStatusSection'
import { inReviewOverviewSection } from './inReviewOverviewSection'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'

export const ApplicantReview: Form = buildForm({
  id: 'applicantReviewForm',
  title: inReview.general.formTitle,
  logo: IcelandHealthLogo,
  children: [
    applicationStatusSection(),
    addAttachmentsSection(),
    inReviewOverviewSection(),
  ],
})

export const AssigneeReview: Form = buildForm({
  id: 'assigneeReviewForm',
  title: inReview.general.formTitle,
  logo: IcelandHealthLogo,
  children: [
    applicationStatusSection(true),
    addAttachmentsSection(true),
    inReviewOverviewSection(true),
  ],
})
