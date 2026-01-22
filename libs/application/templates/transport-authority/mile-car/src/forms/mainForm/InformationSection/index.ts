import { buildSection } from '@island.is/application/core'
import { selectVehicleSection } from './VehicleSelection'
import { selectVehicle as selectVehicleMessages } from '../../../lib/messages'

export const InformationSection = buildSection({
  id: 'information',
  tabTitle: selectVehicleMessages.general.sectionTitle,
  title: selectVehicleMessages.general.sectionTitle,
  children: [selectVehicleSection],
})
