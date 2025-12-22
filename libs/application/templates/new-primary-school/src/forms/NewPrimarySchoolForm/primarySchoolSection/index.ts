import { buildSection } from '@island.is/application/core'
import { primarySchoolMessages } from '../../../lib/messages'
import { counsellingRegardingApplicationSubSection } from './counsellingRegardingApplicationSubSection'
import { currentNurserySubSection } from './currentNurserySubSection'
import { currentSchoolSubSection } from './currentSchoolSubSection'
import { newSchoolSubSection } from './newSchoolSubSection'
import { reasonForApplicationSubSection } from './reasonForApplicationSubSection'
import { schoolSubSection } from './schoolSubSection'
import { siblingsSubSection } from './siblingsSubSection'
import { startingSchoolSubSection } from './startingSchoolSubSection'

export const primarySchoolSection = buildSection({
  id: 'primarySchoolSection',
  title: primarySchoolMessages.shared.sectionTitle,
  children: [
    currentSchoolSubSection,
    currentNurserySubSection,
    schoolSubSection,
    newSchoolSubSection,
    reasonForApplicationSubSection,
    counsellingRegardingApplicationSubSection,
    siblingsSubSection,
    startingSchoolSubSection,
  ],
})
