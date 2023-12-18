import {
  buildCustomField,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { sellerSubSection } from './sellerSubSection'
import { buyerSubSection } from './buyerSubSection'
import { machineSubSection } from './machineSubSection'
import { pickMachineSubSection } from './pickMachineSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickMachineSubSection,
    // here
    buildDataProviderItem({}),
    machineSubSection,
    sellerSubSection,
    buyerSubSection,
  ],
})
