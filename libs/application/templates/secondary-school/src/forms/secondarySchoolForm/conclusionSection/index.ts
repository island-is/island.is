import { getValueViaPath } from '@island.is/application/core'
import { conclusion } from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { ApplicationType } from '../../../utils'

export const conclusionSection = buildFormConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: (application) => {
    const isFreshman =
      getValueViaPath<ApplicationType>(
        application.answers,
        'applicationType.value',
      ) === ApplicationType.FRESHMAN
    return isFreshman
      ? conclusion.general.alertMessageFreshman
      : conclusion.general.alertMessageGeneral
  },
  expandableHeader: conclusion.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: (application) => {
    const isFreshman =
      getValueViaPath<ApplicationType>(
        application.answers,
        'applicationType.value',
      ) === ApplicationType.FRESHMAN
    return isFreshman
      ? conclusion.general.accordionTextFreshman
      : conclusion.general.accordionTextGeneral
  },
})
