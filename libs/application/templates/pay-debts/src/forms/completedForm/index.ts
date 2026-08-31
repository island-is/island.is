import { buildForm, buildSection } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import {
  completedForm as messages,
  debts as debtsMessages,
  payment as paymentMessages,
} from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: FjarsyslaRikisinsLogo,
  children: [
    buildSection({
      id: 'debtsSection',
      title: debtsMessages.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'paymentSection',
      title: paymentMessages.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      sectionTitle: messages.sectionTitle,
      multiFieldTitle: messages.alertTitle,
      alertTitle: messages.alertMessage,
      alertMessage: 'Takk fyrir',
    }),
  ],
})
