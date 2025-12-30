import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedidinsLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: HeilsugaeslaHofudborgarsvaedidinsLogo,
  children: [
    buildFormConclusionSection({
      alertTitle: m.completedForm.alertTitle,
      alertMessage: m.completedForm.alertMessage,
    }),
  ],
})
