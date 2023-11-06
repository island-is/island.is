import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { sellerSubSection } from './sellerSubSection'
import { buyerSubSection } from './buyerSubSection'
import { mainOperatorSubSection } from './mainOperatorSubSection'
import { machineSubSection } from './vehicleSubSection'
import { pickMachineSubSection } from './pickVehicleSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickMachineSubSection,
    machineSubSection,
    sellerSubSection,
    buyerSubSection,
    mainOperatorSubSection,
  ],
})
