import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { machineSubSection } from './machineSubSection'
import { pickMachineSubSection } from './pickMachineSubSection'
import { locationSubSection } from './locationSubSection'
import { contactInformationSubSection } from './contactInformationSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickMachineSubSection,
    machineSubSection,
    locationSubSection,
    contactInformationSubSection,
  ],
})
