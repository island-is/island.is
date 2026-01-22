import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import {
  confirmation as confirmationMessages,
  externalData as externalDataMessages,
  selectVehicle as selectVehicleMessages,
} from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: TransportAuthorityLogo,
  children: [
    buildSection({
      id: 'externalData',
      tabTitle: selectVehicleMessages.general.sectionTitle,
      title: externalDataMessages.dataProvider.sectionTitle,
      children: [],
    }),
    InformationSection,
    buildSection({
      id: 'confirmation',
      tabTitle: selectVehicleMessages.general.sectionTitle,
      title: confirmationMessages.sectionTitle,
      children: [],
    }),
  ],
})
