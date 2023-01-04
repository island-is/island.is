import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { pickVehicleSubSection } from './pickVehicleSubSection'
import { vehicleSubSection } from './vehicleSubSection'
import { sellerSubSection } from './sellerSubSection'
import { buyerSubSection } from './buyerSubSection'
import { mainOperatorSubSection } from './mainOperatorSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickVehicleSubSection,
    vehicleSubSection,
    sellerSubSection,
    buyerSubSection,
    mainOperatorSubSection,
  ],
})
