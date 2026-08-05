import { buildSection } from '@island.is/application/core'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ApplicationType } from '../../../utils/constants'
import { getApplicationAnswers } from '../../../utils/oldAgePensionUtils'
import { employmentRegistrationSubSection } from './employmentRegistrationSubSection'
import { employmentSelfEmployedAttachmentSubSection } from './employmentSelfEmployedAttachmentSubSection'
import { employmentStatusSubSection } from './employmentStatusSubSection'

export const employmentSection = buildSection({
  id: 'employmentSection',
  title: oldAgePensionFormMessage.employer.employerTitle,
  condition: (answers) => {
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.HALF_OLD_AGE_PENSION
  },
  children: [
    employmentStatusSubSection,
    employmentSelfEmployedAttachmentSubSection,
    employmentRegistrationSubSection,
  ],
})
