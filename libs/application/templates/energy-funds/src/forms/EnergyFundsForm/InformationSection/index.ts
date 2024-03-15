import { buildSection } from '@island.is/application/core'
import { vehicleSubSection } from './VehicleSelection'
import { userInformationSubSection } from './UserInformation'
import { information } from '../../../lib/messages/information'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [vehicleSubSection, userInformationSubSection],
})
