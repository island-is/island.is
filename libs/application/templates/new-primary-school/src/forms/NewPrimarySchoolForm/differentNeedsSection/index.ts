import { buildSection } from '@island.is/application/core'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { allergiesAndIntolerancesSubSection } from './allergiesAndIntolerancesSubSection'
import { freeSchoolMealSubSection } from './freeSchoolMealSubSection'
import { languageSubSection } from './languageSubSection'
import { supportSubSection } from './supportSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
  condition: (answers) => {
    // Only display section if "Moving abroad" is not selected as reason for application
    const { reasonForApplication } = getApplicationAnswers(answers)
    return reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
  },
  children: [
    languageSubSection,
    freeSchoolMealSubSection,
    allergiesAndIntolerancesSubSection,
    supportSubSection,
  ],
})
