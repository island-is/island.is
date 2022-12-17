import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { pickVehicleSubSection } from './pickVehicleSubSection'
import { plateReasonSubSection } from './plateReasonSubSection'
import { plateSizeSubSection } from './plateSizeSubSection'
import { plateDeliverySubSection } from './plateDeliverySubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickVehicleSubSection,
    plateReasonSubSection,
    plateSizeSubSection,
    plateDeliverySubSection,
  ],
})
