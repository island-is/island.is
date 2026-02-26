import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedisinsLogo } from '@island.is/application/assets/institution-logos'
import { participantSection } from './participantSection'
import { courseSection } from './courseSection'
import { userInformation } from './userInformation'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [courseSection, userInformation, participantSection],
  logo: HeilsugaeslaHofudborgarsvaedisinsLogo,
})
