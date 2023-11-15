import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { Logo } from '../../assets/Logo'
import { vehicleSubSection } from './VehicleSelection'
import { information } from '../../lib/messages/information'
import { userInformationSubSection } from './UserInformation'

export const EnergyFundsForm: Form = buildForm({
  id: 'EnergyFundsFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [vehicleSubSection, userInformationSubSection],
    }),
  ],
})
