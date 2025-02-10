import { conclusion } from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { checkIsFreshman } from '../../../utils'

export const conclusionSection = buildFormConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: (application) => {
    const isFreshman = checkIsFreshman(application.answers)
    return isFreshman
      ? conclusion.general.alertMessageFreshman
      : conclusion.general.alertMessageGeneral
  },
  expandableHeader: conclusion.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: (application) => {
    const isFreshman = checkIsFreshman(application.answers)
    return isFreshman
      ? conclusion.general.accordionTextFreshman
      : conclusion.general.accordionTextGeneral
  },
})
