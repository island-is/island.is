import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { machineSubSection } from './machineSubSection'
import { pickMachineSubSection } from './pickMachineSubSection'
import { licencePlateSubSection } from './licencePlateSubSection'
import { plateDeliverySubSection } from './plateDeliverySubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickMachineSubSection,
    machineSubSection,
    licencePlateSubSection,
    plateDeliverySubSection,
  ],
})
