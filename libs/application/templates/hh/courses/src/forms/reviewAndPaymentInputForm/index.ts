import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedisinsLogo } from '@island.is/application/assets/institution-logos'
import { payerSection } from '../mainForm/payerSection'
import { overviewSection } from '../mainForm/overview'

export const ReviewAndPaymentInputForm = buildForm({
  id: 'ReviewAndPaymentInputForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HeilsugaeslaHofudborgarsvaedisinsLogo,
  children: [payerSection, overviewSection],
})
