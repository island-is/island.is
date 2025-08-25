import { buildForm, getValueViaPath } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import HmsLogo from '../../assets/HmsLogo'
import * as m from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: HmsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: m.conclusionMessages.title,
      alertTitle: m.conclusionMessages.alertTitle,
      alertMessage: (application) => {
        const terminationType = getValueViaPath<{ answer: string }>(
          application.answers,
          'terminationType',
        )
        return {
          ...(terminationType?.answer === 'cancelation'
            ? m.conclusionMessages.alertMessageCancelation
            : m.conclusionMessages.alertMessageTermination),
        }
      },
    }),
  ],
})
