import { buildSection } from '@island.is/application/core'
import { selectVehicleSection } from './VehicleSelection'

export const InformationSection = buildSection({
  id: 'information',
  title: 'TODO',
  children: [selectVehicleSection],
})
