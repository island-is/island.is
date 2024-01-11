import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ProgramSubSection } from './ProgramSubSection'
import { UserInformationSubSection } from './UserInformationSubSection'
import { ExtraDataProviderSubSection } from './ExtraDataProvider'
import { ExtraPermissionSubSection } from './ExtraPermission'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [
    ProgramSubSection,
    // ExtraDataProviderSubSection,
    // ExtraPermissionSubSection,
    UserInformationSubSection,
  ],
})
