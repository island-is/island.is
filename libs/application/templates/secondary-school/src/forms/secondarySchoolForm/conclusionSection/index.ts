import { getValueViaPath } from '@island.is/application/core'
import { conclusion } from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { ApplicationType } from '../../../utils'

export const conclusionSectionFreshman = buildFormConclusionSection({
  condition: (answers) => {
    return (
      getValueViaPath<ApplicationType>(answers, 'applicationType.value') ===
      ApplicationType.FRESHMAN
    )
  },
  alertTitle: conclusion.general.alertTitle,
  alertMessage: conclusion.general.alertMessageFreshman,
  expandableHeader: conclusion.general.accordionTitle,
  expandableDescription: conclusion.general.accordionTextFreshman,
})

export const conclusionSectionGeneral = buildFormConclusionSection({
  condition: (answers) => {
    return (
      getValueViaPath<ApplicationType>(answers, 'applicationType.value') !==
      ApplicationType.FRESHMAN
    )
  },
  alertTitle: conclusion.general.alertTitle,
  alertMessage: conclusion.general.alertMessageGeneral,
  expandableHeader: conclusion.general.accordionTitle,
  expandableDescription: conclusion.general.accordionTextGeneral,
})
