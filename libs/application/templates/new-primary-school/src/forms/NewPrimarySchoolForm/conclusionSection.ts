import { YES } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusionMessages } from '../../lib/messages'
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
      return conclusionMessages.continuingEnrollmentExpandableDescription
    }

    if (
      applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
      applyForPreferredSchool === YES
    ) {
      return conclusionMessages.enrollmentExpandableDescription
    }

    if (
      hasSpecialEducationSubType(application.answers, application.externalData)
    ) {
      return conclusionMessages.specialEducationExpandableDescription
    }

    return conclusionMessages.expandableDescription
  },
})
