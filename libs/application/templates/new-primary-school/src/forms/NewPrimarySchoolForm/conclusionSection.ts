import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { newPrimarySchoolMessages } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription:
    newPrimarySchoolMessages.conclusion.expandableDescription,
})
