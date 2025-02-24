import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { primarySchoolMessages } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription: primarySchoolMessages.conclusion.expandableDescription,
})
