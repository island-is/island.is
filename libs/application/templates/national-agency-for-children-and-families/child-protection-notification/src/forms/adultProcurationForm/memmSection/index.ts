import { buildSection } from '@island.is/application/core'
import { memmMessages } from '../../../lib/messages'
import { isKnowsNationalId } from '../../../utils/conditionUtils'
import { cultureSubSection } from './cultureSubSection'
import { educationSubSection } from './educationSubSection'
import { receptionSubSection } from './receptionSubSection'
import { wellbeingSubSection } from './wellbeingSubSection'

export const memmSection = buildSection({
  id: 'memmSection',
  title: memmMessages.shared.sectionTitle,
  condition: isKnowsNationalId,
  children: [
    educationSubSection,
    receptionSubSection,
    cultureSubSection,
    wellbeingSubSection,
  ],
})
