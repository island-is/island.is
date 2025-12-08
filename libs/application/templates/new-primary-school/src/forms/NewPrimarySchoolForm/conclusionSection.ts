import { YES } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { hasSpecialEducationSubType } from '../../utils/conditionUtils'
import { ApplicationType } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/newPrimarySchoolUtils'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription: (application) => {
    const { applicationType, applyForPreferredSchool } = getApplicationAnswers(
      application.answers,
    )

    if (applicationType === ApplicationType.CONTINUING_ENROLLMENT) {
      return newPrimarySchoolMessages.conclusion
        .continuingEnrollmentExpandableDescription
    }

    if (
      applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
      applyForPreferredSchool === YES
    ) {
      return newPrimarySchoolMessages.conclusion.enrollmentExpandableDescription
    }

    if (
      hasSpecialEducationSubType(application.answers, application.externalData)
    ) {
      return newPrimarySchoolMessages.conclusion
        .specialEducationExpandableDescription
    }

    return newPrimarySchoolMessages.conclusion.expandableDescription
  },
})
