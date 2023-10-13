import { buildSection } from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { UserInformationSubSection } from './UserInformationSubSection'
import { MaritalStatusSubSection } from './MaritalStatusSubSection'

export const PersonalSection = buildSection({
  id: 'personal',
  title: personal.general.sectionTitle,
  children: [UserInformationSubSection, MaritalStatusSubSection],
})
