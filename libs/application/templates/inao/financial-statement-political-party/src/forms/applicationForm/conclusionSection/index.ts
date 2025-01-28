import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'

export const conclusionSection = buildFormConclusionSection({
  multiFieldTitle: m.received,
  alertTitle: m.returned,
  alertMessage: (application) => {
    const year = getValueViaPath<string>(
      application.answers,
      'conditionalAbout.operatingYear',
    )
    return {
      ...m.conclusionAlertMessage,
      values: { value1: year },
    }
  },
  accordion: false,
})
