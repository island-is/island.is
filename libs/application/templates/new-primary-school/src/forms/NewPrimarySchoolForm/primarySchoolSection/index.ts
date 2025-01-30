import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { currentSchoolSubSection } from './currentSchoolSubSection'
import { newSchoolSubSection } from './newSchoolSubSection'
import { reasonForApplicationSubSection } from './reasonForApplicationSubSection'
import { schoolSubSection } from './schoolSubSection'
import { siblingsSubSection } from './siblingsSubSection'
import { startingSchoolSubSection } from './startingSchoolSubSection'

export const primarySchoolSection = buildSection({
  id: 'primarySchoolSection',
  title: newPrimarySchoolMessages.primarySchool.sectionTitle,
  children: [
    currentSchoolSubSection,
    schoolSubSection,
    newSchoolSubSection,
    reasonForApplicationSubSection,
    siblingsSubSection,
    startingSchoolSubSection,
  ],
})
