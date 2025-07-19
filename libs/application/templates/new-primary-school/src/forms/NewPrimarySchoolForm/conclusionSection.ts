import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { SchoolType } from '../../utils/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/newPrimarySchoolUtils'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription: (application) => {
    const { selectedSchoolType } = getApplicationAnswers(application.answers)

    return selectedSchoolType === SchoolType.PUBLIC_SCHOOL
      ? newPrimarySchoolMessages.conclusion.expandableDescription
      : newPrimarySchoolMessages.conclusion.privateSchoolExpandableDescription
  },
})
