import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { machineSubSection } from './machineSubSection'
import { pickMachineSubSection } from './pickMachineSubSection'
import { locationSubSection } from './locationSubSection'
import { contactInformationSubSection } from './contactInformationSubSection'
import { ApplicantInformationSubSection } from './applicantInformationSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    ApplicantInformationSubSection,
    pickMachineSubSection,
    machineSubSection,
    locationSubSection,
    contactInformationSubSection,
  ],
})
