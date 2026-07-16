import { buildSection } from '@island.is/application/core'
import { memmMessages } from '../../../lib/messages'
import { showMemmSection } from '../../../utils/conditionUtils'
import { cultureSubSection } from './cultureSubSection'
import { educationSubSection } from './educationSubSection'
import { receptionSubSection } from './receptionSubSection'
import { wellbeingSubSection } from './wellbeingSubSection'

export const memmSection = buildSection({
  id: 'memmSection',
  title: memmMessages.shared.sectionTitle,
  //TODO: also add in the condition to check if kerfiskennitala and child is not in school
  condition: showMemmSection,
  children: [
    educationSubSection,
    receptionSubSection,
    cultureSubSection,
    wellbeingSubSection,
  ],
})
