import { buildSection } from '@island.is/application/core'
import { primarySchoolMessages } from '../../../lib/messages'
import { currentNurserySubSection } from './currentNurserySubSection'
import { currentSchoolSubSection } from './currentSchoolSubSection'
import { newSchoolSubSection } from './newSchoolSubSection'
import { reasonForApplicationSubSection } from './reasonForApplicationSubSection'
import { schoolSubSection } from './schoolSubSection'
import { siblingsSubSection } from './siblingsSubSection'
import { startingSchoolSubSection } from './startingSchoolSubSection'

export const primarySchoolSection = buildSection({
  id: 'primarySchoolSection',
  title: primarySchoolMessages.primarySchool.sectionTitle,
  children: [
    currentSchoolSubSection,
    currentNurserySubSection,
    schoolSubSection,
    newSchoolSubSection,
    reasonForApplicationSubSection,
    siblingsSubSection,
    startingSchoolSubSection,
  ],
})
