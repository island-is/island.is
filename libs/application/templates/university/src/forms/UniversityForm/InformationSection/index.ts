import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ProgramSubSection } from './ProgramSubSection'
import { UserInformationSubSection } from './UserInformationSubSection'
import { ModeOfDeliverySubSection } from './ModeOfDeliverySubSection'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [
    ProgramSubSection,
    ModeOfDeliverySubSection,
    UserInformationSubSection,
  ],
})
