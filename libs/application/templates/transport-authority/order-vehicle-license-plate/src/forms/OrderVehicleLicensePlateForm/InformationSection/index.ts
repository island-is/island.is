import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { pickVehicleSubSection } from './pickVehicleSubSection'
import { plateSizeSubSection } from './plateSizeSubSection'
import { plateDeliverySubSection } from './plateDeliverySubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickVehicleSubSection,
    plateSizeSubSection,
    plateDeliverySubSection,
  ],
})
